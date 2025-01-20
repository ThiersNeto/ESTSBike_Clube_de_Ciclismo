const db = require('../Config/Database');

exports.getAllEventTypes = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM event_types');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching event types', error });
  }
};

exports.getEventType = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM event_types WHERE id = ?', [req.params.id]);
    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ message: 'Event type not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching event type', error });
  }
};

exports.createEventType = async (req, res) => {
  try {
    const { name, description } = req.body;
    const [result] = await db.query('INSERT INTO event_types (name, description) VALUES (?, ?)', [name, description]);
    res.status(201).json({ id: result.insertId, name, description });
  } catch (error) {
    res.status(500).json({ message: 'Error creating event type', error });
  }
};

exports.updateEventType = async (req, res) => {
  try {
    const { name, description } = req.body;
    await db.query('UPDATE event_types SET name = ?, description = ? WHERE id = ?', [name, description, req.params.id]);
    res.json({ message: 'Event type updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating event type', error });
  }
};

exports.deleteEventType = async (req, res) => {
  try {
    // Check if there are any events associated with this event type
    const [events] = await db.query('SELECT * FROM events WHERE event_type_id = ?', [req.params.id]);
    if (events.length > 0) {
      return res.status(400).json({ message: 'Cannot delete event type with associated events' });
    }

    await db.query('DELETE FROM event_types WHERE id = ?', [req.params.id]);
    res.json({ message: 'Event type deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting event type', error });
  }
};