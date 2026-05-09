type Props = {
  title: string;
  description?: string;
};

export default function EmptyState({ title, description }: Props) {
  return (
    <div className="text-center py-20">
      <h2 className="text-2xl font-semibold">{title}</h2>

      {description && <p className="text-slate-500 mt-2">{description}</p>}
    </div>
  );
}
