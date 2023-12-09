/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Box, Typography } from '@mui/material';

const emails = ['username@gmail.com', 'user02@gmail.com']

const CalendarComponent: React.FC = () => {
    const [calendarEvents, setCalendarEvents] = useState([
        
        {
          title: 'Název události',
          start: '2023-10-15',
          end: '2023-10-16',
        },
      ]);
    
      const handleEventAdd = (eventAddInfo: any) => {
        setCalendarEvents([...calendarEvents, eventAddInfo.event.toPlainObject()]);
      };
    
      // Vykreslení kalendáře FullCalendar
      return (
        <Box sx={{marginBottom:'5em'}}>
        <Box sx={{marginLeft:'1em'}}>
        <Typography variant='h4'>Kalendář</Typography>
        </Box>
          
        <Box sx={{maxWidth:'1000px', height: "700px" , marginTop:'2em', marginLeft:'auto', marginRight:'auto', paddingBottom:'5em', display:'block'}}>
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay',
            }}
            events={calendarEvents}
            editable={true}
            selectable={true}
            selectMirror={true}
            select={(info: any) => console.log('Selected:', info)}
            eventAdd={handleEventAdd}
          />
        </Box>
        <Box sx={{marginLeft:'1em'}}>
        
        </Box>
        </Box>
      );
    };

export default CalendarComponent