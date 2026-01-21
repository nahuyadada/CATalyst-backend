import { createGroup, getGroupDetailsService } from './group.service.js';
export async function groupCreation(req, res, next) {
    try {
        const { name, description, ownerId } = req.body;

        if (!name || !ownerId) {
        return res.status(400).json({
            success: false,
            message: "Name and Owner ID are required",
        });
        }

        const group = await createGroup({ name, description, ownerId });

        return res.status(201).json({
            success: true,
            message: "Group created successfully",
            data: group,
        });

    } catch (err) {
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
        const group = await getGroupById(groupId);
        res.json({ group });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}