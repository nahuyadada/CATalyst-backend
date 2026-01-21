import supabase from "../../common/config/supabaseClient.js";

// Creates a group to be added in the database
export async function createGroupRepo({ name, description, ownerId, joinCode }) {

  const { data, error } = await supabase.from("Group").insert([{
    name,
    description,
    owner_id: ownerId,
    join_code: joinCode,
  }]).select().single();
  console.log("Supabase Insert Response:", { data, error });
  if (error) {
    throw new Error("Error creating group: " + error.message);
  }
  return data;
  
}

export async function getGroupById(groupId) {
  const { data, error } = await supabase
    .from("Group")
    .select("*")
    .eq("id", groupId)
    .single();
    if (error) {
        throw new Error("Group not found");
    }
    return data;
}

// select dataNeeded = joinCode where joinColumn = id from tableName
export async function getAllDataBy(dataNeed, data,tableName) {
  const {data,error} = await this.supabase.from(tableName).select().contains(dataNeed, data);
  console.log("Supabase Select Response:", { data, error });
  if (error) {
      throw new Error("Group not found");
  }
  return data;
}