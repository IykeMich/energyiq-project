import { useState } from 'react';
import { Button } from '@energyiq/ui';
import { toast } from '@energyiq/ui';
import { CalendarDays, Clock } from 'lucide-react';
import { AnalyticsSectionCard } from '../../analytics/analytics-section-card';
import { SaveTemplateModal, type SavedReportTemplate } from '../modals/save-template-modal';
import {
  METRIC_OPTIONS_MOCK,
  DIMENSION_OPTIONS_MOCK,
  DATE_RANGE_OPTIONS_MOCK,
  SAVED_REPORTS_MOCK,
  type SavedReport,
} from './builder-mocks';
import { SavedReportsTable } from './saved-reports-table';

const SCHEDULE_LABELS: Record<string, string> = {
  'No Schedule': 'No Schedule',
  Hourly: 'Hourly',
  Daily: 'Daily',
  'Weekly (Mon)': 'Weekly (Mon)',
  'Monthly (1st)': 'Monthly(1st)',
  Quarterly: 'Quarterly',
};

export function CustomReportBuilder() {
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
  const [selectedDimension, setSelectedDimension] = useState<string | null>(null);
  const [selectedDateRange, setSelectedDateRange] = useState<string>(DATE_RANGE_OPTIONS_MOCK[0].id);
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [savedReports, setSavedReports] = useState<SavedReport[]>(SAVED_REPORTS_MOCK);

  const toggleMetric = (id: string) => {
    setSelectedMetrics((previous) =>
      previous.includes(id) ? previous.filter((metric) => metric !== id) : [...previous, id],
    );
  };

  const handleSaveTemplate = (template: SavedReportTemplate) => {
    const newReport: SavedReport = {
      id: `${savedReports.length + 1}`,
      name: template.name,
      metrics: template.metrics.join(', '),
      schedule: SCHEDULE_LABELS[template.schedule] ?? 'No Schedule',
      last_run: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
      }),
    };
    setSavedReports((previous) => [newReport, ...previous]);
    toast.success(`Template Saved`, {
      description: `"${template.name}" has been added to your saved reports.`,
    });
  };

  const selectedMetricLabels = METRIC_OPTIONS_MOCK
    .filter((metric) => selectedMetrics.includes(metric.id))
    .map((metric) => metric.label);

  return (
    <section className="flex flex-col gap-6">
      <header className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Custom Report Builder</h1>
          <p className="text-sm text-[#FFFFFFCC] mt-1">
            Select your metrics, dimensions, and filters to generate a bespoke report.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="border-[#616161B2] text-white hover:bg-[#FFFFFF1A]"
            onClick={() => toast.info('Schedule Report', { description: 'Scheduling coming soon.' })}
          >
            <Clock className="w-4 h-4 mr-1.5" />
            Schedule Report
          </Button>
          <Button
            className="bg-[#FBC02D] text-[#121212] hover:bg-[#FBC02D]/90"
            onClick={() => toast.success('Report Generated', { description: 'Your custom report is ready.' })}
          >
            Generate Report
          </Button>
        </div>
      </header>

      <AnalyticsSectionCard title="Select Metrics" action={<span className="text-xs text-[#FBC02D] cursor-pointer hover:underline">Save as Template</span>}>
        <div className="flex flex-wrap gap-3">
          {METRIC_OPTIONS_MOCK.map((metric) => {
            const selected = selectedMetrics.includes(metric.id);
            return (
              <button
                key={metric.id}
                type="button"
                onClick={() => toggleMetric(metric.id)}
                className={`tap-effect rounded-full border px-4 py-2 text-xs font-medium transition-colors ${
                  selected
                    ? 'border-[#FBC02D] bg-[#FBC02D] text-[#121212]'
                    : 'border-[#616161B2] bg-transparent text-[#FAFAFA] hover:bg-[#FFFFFF1A]'
                }`}
              >
                {metric.label}
              </button>
            );
          })}
        </div>
      </AnalyticsSectionCard>

      <AnalyticsSectionCard title="Group by & Filters">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-3">
            <span className="text-sm font-medium text-[#FAFAFA]">Group by dimension:</span>
            <div className="flex flex-wrap gap-3">
              {DIMENSION_OPTIONS_MOCK.map((dimension) => {
                const selected = selectedDimension === dimension.id;
                return (
                  <button
                    key={dimension.id}
                    type="button"
                    onClick={() => setSelectedDimension(selected ? null : dimension.id)}
                    className={`tap-effect rounded-full border px-4 py-2 text-xs font-medium transition-colors ${
                      selected
                        ? 'border-[#FBC02D] bg-[#FBC02D] text-[#121212]'
                        : 'border-[#616161B2] bg-transparent text-[#FAFAFA] hover:bg-[#FFFFFF1A]'
                    }`}
                  >
                    {dimension.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-sm font-medium text-[#FAFAFA]">Date Range:</span>
            <div className="flex flex-wrap gap-3">
              {DATE_RANGE_OPTIONS_MOCK.map((range) => {
                const selected = selectedDateRange === range.id;
                return (
                  <button
                    key={range.id}
                    type="button"
                    onClick={() => setSelectedDateRange(range.id)}
                    className={`tap-effect rounded-full border px-4 py-2 text-xs font-medium transition-colors ${
                      selected
                        ? 'border-[#FBC02D] bg-[#FBC02D] text-[#121212]'
                        : 'border-[#616161B2] bg-transparent text-[#FAFAFA] hover:bg-[#FFFFFF1A]'
                    }`}
                  >
                    {range.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </AnalyticsSectionCard>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setSaveModalOpen(true)}
          className="text-sm font-medium text-[#FBC02D] hover:underline"
        >
          Save as Template
        </button>
      </div>

      <AnalyticsSectionCard title="Your Saved Reports" action={<CalendarDays className="h-4 w-4 text-[#FBC02D]" />}>
        <SavedReportsTable reports={savedReports} />
      </AnalyticsSectionCard>

      <SaveTemplateModal
        open={saveModalOpen}
        onOpenChange={setSaveModalOpen}
        metrics={selectedMetricLabels}
        onSave={handleSaveTemplate}
      />
    </section>
  );
}
