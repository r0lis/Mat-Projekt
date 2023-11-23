/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

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
        <div style={{maxWidth:'900px', height:'400px' , marginTop:'2em', marginLeft:'auto', marginRight:'auto'}}>
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
        </div>
      );
    };

export default CalendarComponent