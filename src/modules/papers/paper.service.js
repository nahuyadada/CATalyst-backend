/**
 * Service layer: interacts with Supabase (DB + Storage).
 * Responsibilities:
 *  - Upload file buffers to Supabase Storage
 *  - Insert / update / delete rows in `papers` table
 *  - Return normalized objects for controllers
 *
 * Implementation notes:
 *  - We use multer memoryStorage so files are available as `req.file.buffer`.
 *  - Files are stored in a bucket (SUPABASE_BUCKET). The file path includes a UUID and timestamp to avoid collisions.
 */

// const { supabase } = require('../../common/config/supabaseClient');
import supabase from '../../common/config/supabaseClient.js';
// const { v4: uuidv4 } = require('uuid');
import { v4 as uuidv4 } from 'uuid';

const BUCKET = process.env.SUPABASE_BUCKET || 'paper-files';

/**
 * Helper: upload a file buffer to Supabase storage
 * returns { path, publicURL }
 */
async function uploadFileToStorage(fileBuffer, filename, mimeType) {
  if (!fileBuffer) return null;

  // create a safe, unique path
  const uniqueName = `${Date.now()}_${uuidv4()}_${filename.replace(/\s+/g, '_')}`;
  const path = uniqueName;

  // Upload buffer. In @supabase/supabase-js v2 you can pass a Buffer directly.
  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(path, fileBuffer, {
      contentType: mimeType,
      // upsert: false // default
    });

  if (uploadError) {
    const err = new Error('Failed to upload file to storage');
    err.details = uploadError;
    throw err;
  }

  // Get public URL (if bucket is public). If you use private bucket, switch to createSignedUrl
  const { data: publicUrlData } = supabase.storage.from(BUCKET).getPublicUrl(path);
  const publicURL = publicUrlData?.publicUrl || null;

  return { path, publicURL };
}

/**
 * Create a new paper record (text and/or file)
 */
async function createPaper({ title, content_text, file, metadata }) {
  // if file exists, upload
  let file_path = null;
  let file_url = null;

  if (file) {
    const res = await uploadFileToStorage(file.buffer, file.originalname, file.mimetype);
    file_path = res.path;
    file_url = res.publicURL;
  }

  // insert into table
  const insertRow = {
    title,
    content_text: content_text || null,
    file_path,
    file_url,
    metadata: metadata || {}
  };

  const { data, error } = await supabase.from('papers').insert(insertRow).select().single();

  if (error) {
    const err = new Error('Failed to insert paper into DB');
    err.details = error;
    throw err;
  }

  return data;
}

/**
 * List papers with pagination
 */
async function listPapers({ page = 1, pageSize = 20 } = {}) {
  // const from = (page - 1) * pageSize;
  // const to = from + pageSize - 1;

  // const { data, error, count } = await supabase
  //   .from('papers')
  //   .select('*', { count: 'estimated' })
  //   .order('created_at', { ascending: false })
  //   .range(from, to);

  // if (error) {
  //   const err = new Error('Failed to fetch papers');
  //   err.details = error;
  //   throw err;
  // }

  // return {
  //   items: data,
  //   meta: {
  //     page,
  //     pageSize,
  //     total: count !== null ? count : undefined
  //   }
  // };
  return{
    items: ["eee0","eeee"],
  }
}

/**
 * Get single paper by id
 */
async function getPaperById(id) {
  const { data, error } = await supabase.from('papers').select('*').eq('id', id).single();

  if (error && error.code !== 'PGRST116') { // PGRST116 = no rows? (varies) - safe to return null
    const err = new Error('Failed to fetch paper');
    err.details = error;
    throw err;
  }

  return data || null;
}

/**
 * Update paper by id. If a new file is uploaded, upload it and replace file_path/file_url.
 * If previous file exists, attempt to remove it from storage.
 */
async function updatePaper(id, { title, content_text, file, metadata }) {
  const existing = await getPaperById(id);
  if (!existing) return null;

  let file_path = existing.file_path;
  let file_url = existing.file_url;

  if (file) {
    // upload new file
    const res = await uploadFileToStorage(file.buffer, file.originalname, file.mimetype);
    // remove old file if exists
    if (existing.file_path) {
      try {
        await supabase.storage.from(BUCKET).remove([existing.file_path]);
      } catch (remErr) {
        // do not block update on deletion failure, but log
        console.warn('Failed to remove old file from storage', remErr);
      }
    }
    file_path = res.path;
    file_url = res.publicURL;
  }

  const updateRow = {
    title: title !== undefined ? title : existing.title,
    content_text: content_text !== undefined ? content_text : existing.content_text,
    file_path,
    file_url,
    metadata: metadata !== undefined ? metadata : existing.metadata,
    updated_at: new Date().toISOString()
  };

  const { data, error } = await supabase.from('papers').update(updateRow).eq('id', id).select().single();

  if (error) {
    const err = new Error('Failed to update paper');
    err.details = error;
    throw err;
  }

  return data;
}

/**
 * Delete paper by id. Also remove file from storage if present.
 */
async function deletePaper(id) {
  const existing = await getPaperById(id);
  if (!existing) return null;

  // delete DB row first
  const { error: deleteError } = await supabase.from('papers').delete().eq('id', id);

  if (deleteError) {
    const err = new Error('Failed to delete paper from DB');
    err.details = deleteError;
    throw err;
  }

  // remove file from storage (non-blocking)
  if (existing.file_path) {
    const { error: removeError } = await supabase.storage.from(BUCKET).remove([existing.file_path]);
    if (removeError) {
      console.warn('Failed to remove file from storage after deletion', removeError);
      // don't throw; deletion succeeded in DB
    }
  }

  return true;
}


export default {
  createPaper,
  listPapers,
  getPaperById,
  updatePaper,
  deletePaper
};
