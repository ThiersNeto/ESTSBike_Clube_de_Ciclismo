const express = require('express');
const cors = require('cors');
const eventTypeRoutes = require('./Routes/eventTypeRoutes');
const eventRoutes = require('./Routes/eventRoutes');
const memberRoutes = require('./Routes/memberRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/event-types', eventTypeRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/members', memberRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));