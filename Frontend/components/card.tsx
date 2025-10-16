type CardProps = {
  icon: React.ReactNode;
  title: string;
  index: number;
  summary: string;
};

function Card({ icon, title, index, summary }: CardProps) {
  return (
    <div
      key={title}
      className="bg-card-background flex flex-col justify-center items-center gap-y-5 text-center p-10 rounded-md"
    >
      <div className="bg-[#e5e5e5] p-4 text-[1.5rem] text-primary-background rounded-full">
        {icon}
      </div>
      <div className="font-semibold space-x-2">
        <span>{index + 1}.</span>
        <span className="capitalize">{title}</span>
      </div>
      <div className="text-[.9rem]">{summary}</div>
    </div>
  );
}

export default Card;
