const db = require('../Config/Database');

exports.getAllMembers = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM members');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching members', error });
  }
};

exports.getMember = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM members WHERE id = ?', [req.params.id]);
    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ message: 'Member not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching member', error });
  }
};

exports.createMember = async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const [result] = await db.query(
      'INSERT INTO members (name, email, phone) VALUES (?, ?, ?)',
      [name, email, phone]
    );
    res.status(201).json({ id: result.insertId, name, email, phone });
  } catch (error) {
    res.status(500).json({ message: 'Error creating member', error });
  }
};

exports.updateMember = async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    await db.query(
      'UPDATE members SET name = ?, email = ?, phone = ? WHERE id = ?',
      [name, email, phone, req.params.id]
    );
    res.json({ message: 'Member updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating member', error });
  }
};

exports.deleteMember = async (req, res) => {
  try {
    // Check if the member is registered for any events
    const [registrations] = await db.query('SELECT * FROM member_events WHERE member_id = ?', [req.params.id]);
    if (registrations.length > 0) {
      return res.status(400).json({ message: 'Cannot delete member with event registrations' });
    }

    await db.query('DELETE FROM members WHERE id = ?', [req.params.id]);
    res.json({ message: 'Member deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting member', error });
  }
};

exports.getMemberPreferences = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT et.* FROM event_types et JOIN member_event_types met ON et.id = met.event_type_id WHERE met.member_id = ?',
      [req.params.id]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching member preferences', error });
  }
};

exports.addMemberPreference = async (req, res) => {
  try {
    const { event_type_id } = req.body;
    await db.query(
      'INSERT INTO member_event_types (member_id, event_type_id) VALUES (?, ?)',
      [req.params.id, event_type_id]
    );
    res.status(201).json({ message: 'Member preference added successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error adding member preference', error });
  }
};

exports.removeMemberPreference = async (req, res) => {
  try {
    await db.query(
      'DELETE FROM member_event_types WHERE member_id = ? AND event_type_id = ?',
      [req.params.id, req.params.eventTypeId]
    );
    res.json({ message: 'Member preference removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error removing member preference', error });
  }
};