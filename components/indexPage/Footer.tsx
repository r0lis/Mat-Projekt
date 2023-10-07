import React from 'react';

function Footer() {
  const footerContainerStyle: React.CSSProperties = {
    borderTop: '7px solid #B71DDE',
    marginTop: '5%',
    display: 'flex',
    justifyContent: 'space-between',
    padding: '20px',
  };

  const columnStyle: React.CSSProperties = {
    flex: '1',
    textAlign: 'left',
  };

  const todoStyle: React.CSSProperties = {
    display: 'flex',
    marginLeft: '15%',
    marginRight: 'auto',
    flex: '3', // Toto nastavuje šířku pro celý sloupec 'todo'
  };

  const footerBarStyle: React.CSSProperties = {
    backgroundColor: '#B71DDE', // Barva pozadí
    height: '60px', // Výška 10%
    display: 'flex',
    alignItems: 'center', // Zarovnání obsahu na střed
    justifyContent: 'center', // Zarovnání textu na střed
    color: 'white', // Barva textu
  };

  return (
    <><div style={footerContainerStyle}>
          <div style={todoStyle}>
              <div style={columnStyle}>
                  <p>LOGO NAZEV</p>
                  <p>eSports.cz, s.r.o.</p>
                  <p>Jeřabinová 836/30</p>
                  <p>326 00 Plzeň</p>
                  <p>IČ: 26340933</p>
                  <p>DIČ: CZ 26340933</p>
              </div>

              <div style={columnStyle}>
                  <p>Pro více informací nás kontaktujte</p>
                  <p>firma@esports.cz</p>
                  <p>Lukáš Rolenec</p>
                  <p>rilencrtgr@esports.cz</p>
                  <p>999 999 999</p>
              </div>

              <div style={columnStyle}>
                  <p>Sledujte nás na sítích</p>
                  {/* Sem můžete přidat ikony nebo odkazy na sociální sítě */}
              </div>
          </div>

      </div><div style={footerBarStyle}>
              LOGO
          </div></>
  );
}

export default Footer;
