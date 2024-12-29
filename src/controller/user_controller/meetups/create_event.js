const db = require('../../../db/db');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '..', '..', '..', '..', 'public', 'Event_Posters');


module.exports.create_event = async (req, res) => {
    try {
        const email = req.user.email;
        const { event_title, event_description, event_date, start_time, end_time, schedule_type, event_address, event_city, event_state, event_pincode, event_agenda, ticket_title, ticket_description, ticket_type, ticket_price, ticket_quantity, ticket_date, ticket_end_date, organization_name, organizer_name, organizer_contact, contact_visibility, event_type, event_category } = req.body;
        const contactVisibilityValue = contact_visibility ? 1 : 0;
        const event_poster = req.file ? req.file.filename : null;

        db.query(
            'INSERT INTO events (event_title, event_description, event_poster, event_date, start_time, end_time, schedule_type, event_address, event_city, event_state, event_pincode, event_agenda,organization_name, organizer_name, organizer_contact, contact_visibility, event_type, event_category, created_by_email) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [event_title, event_description, event_poster, event_date, start_time, end_time, schedule_type, event_address, event_city, event_state, event_pincode, event_agenda, organization_name, organizer_name, organizer_contact, contactVisibilityValue, event_type, event_category, email],
            function (error, results, fields) {
                if (error) {
                    console.error('Error creating event:', error);




                    return res.render('user/error500');
                }
                const event_id = results.insertId;

                db.query(
                    'INSERT INTO tickets (event_id, ticket_title, ticket_description, ticket_type, ticket_price, ticket_quantity, ticket_date, ticket_end_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                    [event_id, ticket_title, ticket_description, ticket_type, ticket_price, ticket_quantity, ticket_date, ticket_end_date],
                    function (error, results, fields) {
                        if (error) {
                            console.error('error creating tickets');
                            return res.status(500).json({ error: "Internal server error" });

                        }
                        if (req.file) {
                            const imagePath = path.join(uploadDir, req.file.filename);
                            fs.unlinkSync(imagePath);
                        }
                        res.redirect('/create_event')
                    });

            })



    }
    catch (error) {
        console.error('Error creating event:', error);
        return res.render('user/error500');
    }
}

