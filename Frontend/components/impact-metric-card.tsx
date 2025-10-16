type ImpactMetricCardProps = {
  icon: React.ReactNode;
  title: string;
  value: string | number;
};

function ImpactMetricCard({ icon, title, value }: ImpactMetricCardProps) {
  return (
    <div
      key={title}
      className="bg-card-background p-10 rounded-md flex flex-col justify-center items-center gap-y-2 text-center w-full"
    >
      <div className="text-btn-primary text-[3rem]">{icon}</div>
      <div className="text-[2rem] font-bold">{value}</div>
      <p className="text-[1rem] capitalize font-medium">{title}</p>
    </div>
  );
}

export default ImpactMetricCard;
