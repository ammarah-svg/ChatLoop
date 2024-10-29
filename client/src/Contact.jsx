import Avatar from "./Avatar.jsx";

export default function Contact({id,username,onClick,selected,online}) {
  return (
    <div key={id} onClick={() => onClick(id)}
         className={"border-b border-slate-100 text-white flex items-center shadow hover:shadow-2xl shadow-slate-200 gap-2 cursor-pointer "+(selected ? ' text-black bg-[#dfa8b9] ' : '')}>
      {selected && (
        <div className="w-1 bg-[#77676e] h-12 text-black rounded-r-md"></div>
      )}
      <div className="flex gap-2 py-2 pl-4 items-center">
        <Avatar online={online} username={username} userId={id} />
        <span className="capitalize">{username}</span>
      </div>
    </div>
  );
}