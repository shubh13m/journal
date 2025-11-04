import React from "react";

const JournalCard = ({ journal }) => (
  <div className="border rounded-lg p-4 bg-gray-100 hover:bg-gray-200 transition">
    <h4 className="font-bold text-lg text-gray-800">{journal.title}</h4>
    <p className="text-gray-600 mt-2">{journal.content}</p>
    <div className="mt-2 text-sm text-gray-500 flex items-center gap-2">
      {journal.visibility === "SPECIFIC" && <span>👥 Shared</span>}
      {journal.visibility === "PRIVATE" && <span>🔒 Private</span>}
      {journal.visibility === "PUBLIC" && <span>🌍 Public</span>}
      <span>— by {journal.author?.username || "Unknown"}</span>
    </div>
  </div>
);

export default JournalCard;
