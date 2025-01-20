const db = require('../Config/Database');

exports.getAllEvents = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM events');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching events', error });
  }
};

exports.getEvent = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM events WHERE id = ?', [req.params.id]);
    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ message: 'Event not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching event', error });
  }
};

exports.createEvent = async (req, res) => {
  try {
    const { name, date, description, event_type_id } = req.body;
    const [result] = await db.query(
      'INSERT INTO events (name, date, description, event_type_id) VALUES (?, ?, ?, ?)',
      [name, date, description, event_type_id]
    );
    res.status(201).json({ id: result.insertId, name, date, description, event_type_id });
  } catch (error) {
    res.status(500).json({ message: 'Error creating event', error });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const { name, date, description, event_type_id } = req.body;
    await db.query(
      'UPDATE events SET name = ?, date = ?, description = ?, event_type_id = ? WHERE id = ?',
      [name, date, description, event_type_id, req.params.id]
    );
    res.json({ message: 'Event updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating event', error });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    // Check if there are any members registered for this event
    const [registrations] = await db.query('SELECT * FROM member_events WHERE event_id = ?', [req.params.id]);
    if (registrations.length > 0) {
      return res.status(400).json({ message: 'Cannot delete event with registered members' });
    }

    await db.query('DELETE FROM events WHERE id = ?', [req.params.id]);
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting event', error });
  }
};