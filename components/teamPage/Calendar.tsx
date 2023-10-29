import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

const emails = ['username@gmail.com', 'user02@gmail.com']

const CalendarComponent: React.FC = () => {
    const [calendarEvents, setCalendarEvents] = useState([
        // Zde můžete přidat události do kalendáře ve formátu, který očekává FullCalendar
        // Například:
        {
          title: 'Název události',
          start: '2023-10-15',
          end: '2023-10-16',
        },
        // Další události...
      ]);
    
      // Funkce pro zachycení změn v kalendáři (přidání/úprava/odstranění události)
      const handleEventAdd = (eventAddInfo: any) => {
        // Zde můžete aktualizovat stav událostí v kalendáři podle akce uživatele
        setCalendarEvents([...calendarEvents, eventAddInfo.event.toPlainObject()]);
      };
    
      // Vykreslení kalendáře FullCalendar
      return (
        <div style={{maxWidth:'1000px', marginTop:'2em', marginLeft:'auto', marginRight:'auto'}}>
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