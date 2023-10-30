

import { Button } from '@mui/material';
import React from 'react';
import Link from 'next/link';

type MembersProps = {
  id: string; // Assuming id is of type string
};

const MembersComponent: React.FC<MembersProps> = ({ id }) => {  return (
    <div>
      {/* Your Overview Component content */}
      <h2>members</h2>

      <Link href={`/Team/AddMember/${id}/`}><Button variant="contained">Přidat nového hráče</Button></Link>
      {/* Add your specific content here */}
    </div>
  );
};

export default MembersComponent;