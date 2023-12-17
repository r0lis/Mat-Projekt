import React from "react";

interface ContentProps {
  subteamId: string;
}

const Content: React.FC<ContentProps> = ({ subteamId }) => {
  // Your Content component logic here
  return <div>Content for subteam {subteamId}</div>;
};

export default Content;