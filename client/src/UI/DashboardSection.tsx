interface DashboardSectionProps {
  title: string;
  //   children: React.ReactNode;
  description?: string;
}

export const DashboardSection: React.FC<DashboardSectionProps> = ({
  title,

  description,
}) => (
  <div className="mb-8">
    <div className="mb-4">
      <h2 className="text-xl font-semibold text-gray-700">{title}</h2>
      {description && (
        <p className="text-sm text-gray-500 mt-1">{description}</p>
      )}
    </div>
    {/* {children} */}
  </div>
);
