interface Props {
  activity: {
    title: string;
    description: string;
    date: string;
  }[];
}

export function DocumentActivity({
  activity,
}: Props) {
  return (
    <div className="rounded-3xl border border-[#2A2A2A] bg-[#121212] p-5">
      <h3 className="mb-5 text-sm font-medium text-white">
        Activity
      </h3>

      <div className="space-y-5">
        {activity.map((item) => (
          <div
            key={item.title}
            className="relative pl-5"
          >
            <span className="absolute left-0 top-1 h-2 w-2 rounded-full bg-[#F4B400]" />

            <h4 className="text-xs text-white">
              {item.title}
            </h4>

            <p className="mt-1 text-xs text-gray-500">
              {item.description}
            </p>

            <p className="mt-1 text-[11px] text-gray-600">
              {item.date}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}