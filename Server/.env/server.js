const express = require('express');
const bodyParser = require('body-parser');
const eventTypeRoutes = require('./Routes/eventTypeRoutes');
const eventRoutes = require('./Routes/eventRoutes');
const memberRoutes = require('./Routes/memberRoutes');

const app = express();

app.use(bodyParser.json());

app.use('/api/event-types', eventTypeRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/members', memberRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));