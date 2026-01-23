import { createGroupService,getGroupsByIdService,joinGroupService} from './group.service.js';
// used
export async function groupCreation(req, res, next) {
  try {
    const { name, description, ownerId, color } = req.body;

    if (!name || !ownerId) {
      return res.status(400).json({
        success: false,
        message: "Name and Owner ID are required",
      });
    }

    const result = await createGroupService({ name, description, ownerId, color });

    return res.status(result.status).json({
      success: true,
      message: result.message,
      data: result.data || null,
    });

  } catch (err) {
    console.error("Group Creation Error:", err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}



export async function getGroupDetails(req, res) {
    try {
        const { groupId } = req.params;
        if (!groupId) {
            return res.status(400).json({ error: "Group ID is required" });
        }
        // const group = await getGroupById(groupId);
        // res.json({ group });

        return res.status(201).json({ success: true, message: "Group details fetched successfully", data: group, });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}
//  used
export async function joinGroup(req, res) {
    try {
        const { userId, joinCode } = req.body;  
        if (!userId || !joinCode) {
            return res.status(400).json({ error: "User ID and Join Code are required" });
        }
        const joinResult = await joinGroupService(userId, joinCode);
        return res.status(joinResult.status).json({
            message: joinResult.message,
            data: joinResult.data || null
        });
    } catch (err) {
        return res.status(500).json({ error: err.message });
        
    }
}

export async function getJoinCode(req, res) {
    try {
        const { joinCode } = req.params;
        if (!joinCode) {
            return res.status(400).json({ error: "Join Code is required" });
        }
        const group = await getGroupByJoinCode(joinCode);
        res.json({ group });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}
export async function getGroupsById(req, res) {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: "ID is required" });
        }
        const groups = await getGroupsByIdService(id);
        console.log("Invites: ",groups);
        res.json({ groups });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}