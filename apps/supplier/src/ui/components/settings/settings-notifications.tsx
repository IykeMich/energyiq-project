import { useState } from 'react';
import {
  useForm,
  type Control,
  type UseFormWatch,
  type UseFormSetValue,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@energyiq/ui';
import { cn } from '@energyiq/shared';
import {
  notificationPreferencesSchema,
  type NotificationPreferencesFormData,
} from '@/ui/validation/settings/notifications';
import {
  NOTIFICATION_EVENTS_MOCK,
  NOTIFICATION_CHANNELS_MOCK,
  DIGEST_FREQUENCY_MOCK,
  DIGEST_FREQUENCY_OPTIONS_MOCK,
  type NotificationEventMock,
  type ChannelMock,
  type DigestFrequencyMock,
} from './settings-mocks';
import { SettingsCheckbox } from './settings-checkbox';

export function SettingsNotifications() {
  const [isEditing, setIsEditing] = useState(false);
  const { control, handleSubmit, watch, setValue } = useForm<NotificationPreferencesFormData>({
    resolver: zodResolver(notificationPreferencesSchema),
    defaultValues: {
      new_order_placement: NOTIFICATION_EVENTS_MOCK[0].channels,
      payment_alerts: NOTIFICATION_EVENTS_MOCK[1].channels,
      dispute_issues: NOTIFICATION_EVENTS_MOCK[2].channels,
      kyc_document_expiring: NOTIFICATION_EVENTS_MOCK[3].channels,
      tier_change: NOTIFICATION_EVENTS_MOCK[4].channels,
      low_inventory_alert: NOTIFICATION_EVENTS_MOCK[5].channels,
      channels: {
        email: true,
        sms: true,
        in_app: true,
      },
      digest_frequency: {
        transaction_summary: DIGEST_FREQUENCY_MOCK[0].value,
        kyc_compliance_alerts: DIGEST_FREQUENCY_MOCK[1].value,
        analytic_report: DIGEST_FREQUENCY_MOCK[2].value,
      },
    },
  });

  const channels = watch('channels');

  const onSubmit = (data: NotificationPreferencesFormData) => {
    // TODO(orval): wire PATCH notification preferences endpoint once it lands.
    // eslint-disable-next-line no-console
    console.log('Save notification preferences', data);
    setIsEditing(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-white">Notifications Preferences</h2>
        </div>
        {isEditing ? (
          <Button
            type="submit"
            className="bg-[#FBC02D] text-[#121212] hover:bg-[#FBC02D]/90"
          >
            Save Preferences
          </Button>
        ) : (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center justify-center h-8 gap-1.5 px-2.5 rounded-lg text-sm font-medium bg-[#FBC02D] text-[#121212] hover:bg-[#FBC02D]/90"
          >
            Edit Preferences
          </button>
        )}
      </div>

      <div className="bg-[#6161611A] rounded-[18px] p-6 space-y-8">
        {/* Event Notifications */}
        <section>
          <h3 className="text-base font-medium text-white mb-4">Event Notifications</h3>
          <div className="bg-[#FFFFFF1A] rounded-2xl p-5">
            <div className="grid grid-cols-[1fr_80px_80px_80px] gap-4 text-xs font-medium text-[#FFFFFFCC] pb-3 border-b border-[#616161B2]">
              <span>Event</span>
              <span className="text-center">In-App</span>
              <span className="text-center">Email</span>
              <span className="text-center">SMS</span>
            </div>
            <div className="space-y-1">
              {NOTIFICATION_EVENTS_MOCK.map((event) => (
                <EventNotificationRow
                  key={event.id}
                  event={event}
                  isEditing={isEditing}
                  control={control}
                  watch={watch}
                  setValue={setValue}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Channels & Digest Frequency */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <section>
            <h3 className="text-base font-medium text-white mb-4">Channels</h3>
            <div className="bg-[#FFFFFF1A] rounded-2xl p-5 space-y-4">
              {NOTIFICATION_CHANNELS_MOCK.map((channel) => (
                <ChannelRow
                  key={channel.id}
                  channel={channel}
                  isEditing={isEditing}
                  channels={channels}
                  setValue={setValue}
                />
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-base font-medium text-white mb-4">Digest Frequency</h3>
            <div className="bg-[#FFFFFF1A] rounded-2xl p-5 space-y-4">
              {DIGEST_FREQUENCY_MOCK.map((digest) => (
                <DigestFrequencyRow
                  key={digest.id}
                  digest={digest}
                  isEditing={isEditing}
                  control={control}
                  watch={watch}
                  setValue={setValue}
                />
              ))}
            </div>
          </section>
        </div>
      </div>
    </form>
  );
}

const EVENT_FIELD_MAP: Record<string, keyof NotificationPreferencesFormData> = {
  'event-001': 'new_order_placement',
  'event-002': 'payment_alerts',
  'event-003': 'dispute_issues',
  'event-004': 'kyc_document_expiring',
  'event-005': 'tier_change',
  'event-006': 'low_inventory_alert',
};

interface EventNotificationRowProps {
  event: NotificationEventMock;
  isEditing: boolean;
  control: Control<NotificationPreferencesFormData>;
  watch: UseFormWatch<NotificationPreferencesFormData>;
  setValue: UseFormSetValue<NotificationPreferencesFormData>;
}

function EventNotificationRow({
  event,
  isEditing,
  watch,
  setValue,
}: EventNotificationRowProps) {
  const fieldName = EVENT_FIELD_MAP[event.id];
  const values = watch(fieldName) as { in_app: boolean; email: boolean; sms: boolean };

  const toggleChannel = (channel: keyof typeof values) => {
    setValue(fieldName, { ...values, [channel]: !values[channel] });
  };

  return (
    <div className="grid grid-cols-[1fr_80px_80px_80px] gap-4 py-3 items-center border-b border-[#616161B2] last:border-0">
      <span className="text-sm text-white">{event.label}</span>
      <div className="flex justify-center">
        {isEditing ? (
          <SettingsCheckbox
            checked={values.in_app}
            onCheckedChange={() => toggleChannel('in_app')}
            label={`${event.label} in-app notification`}
          />
        ) : (
          <StatusBadge active={values.in_app} />
        )}
      </div>
      <div className="flex justify-center">
        {isEditing ? (
          <SettingsCheckbox
            checked={values.email}
            onCheckedChange={() => toggleChannel('email')}
            label={`${event.label} email notification`}
          />
        ) : (
          <StatusBadge active={values.email} />
        )}
      </div>
      <div className="flex justify-center">
        {isEditing ? (
          <SettingsCheckbox
            checked={values.sms}
            onCheckedChange={() => toggleChannel('sms')}
            label={`${event.label} SMS notification`}
          />
        ) : (
          <StatusBadge active={values.sms} />
        )}
      </div>
    </div>
  );
}

function StatusBadge({ active }: { active: boolean }) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
        active
          ? 'bg-success/20 text-success'
          : 'bg-[#FFFFFF1A] text-[#FFFFFFCC]',
      )}
    >
      {active ? 'On' : 'Off'}
    </span>
  );
}

interface ChannelRowProps {
  channel: ChannelMock;
  isEditing: boolean;
  channels: { email: boolean; sms: boolean; in_app: boolean };
  setValue: UseFormSetValue<NotificationPreferencesFormData>;
}

const CHANNEL_KEY_MAP: Record<string, keyof NotificationPreferencesFormData['channels']> = {
  'channel-email': 'email',
  'channel-sms': 'sms',
  'channel-in-app': 'in_app',
};

function ChannelRow({ channel, isEditing, channels, setValue }: ChannelRowProps) {
  const key = CHANNEL_KEY_MAP[channel.id];

  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-white">{channel.label}</p>
        <p className="text-xs text-[#FFFFFFCC] mt-0.5">{channel.value}</p>
      </div>
      {isEditing ? (
        <SettingsCheckbox
          checked={channels[key]}
          onCheckedChange={(checked) => setValue('channels', { ...channels, [key]: checked })}
          label={`${channel.label} channel`}
        />
      ) : (
        <span
          className={cn(
            'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium',
            channel.active
              ? 'bg-success/20 text-success'
              : 'bg-[#FFFFFF1A] text-[#FFFFFFCC]',
          )}
        >
          {channel.active ? 'Active' : 'Inactive'}
        </span>
      )}
    </div>
  );
}

const DIGEST_KEY_MAP: Record<string, keyof NotificationPreferencesFormData['digest_frequency']> = {
  'digest-001': 'transaction_summary',
  'digest-002': 'kyc_compliance_alerts',
  'digest-003': 'analytic_report',
};

interface DigestFrequencyRowProps {
  digest: DigestFrequencyMock;
  isEditing: boolean;
  control: Control<NotificationPreferencesFormData>;
  watch: UseFormWatch<NotificationPreferencesFormData>;
  setValue: UseFormSetValue<NotificationPreferencesFormData>;
}

function DigestFrequencyRow({
  digest,
  isEditing,
  watch,
  setValue,
}: DigestFrequencyRowProps) {
  const key = DIGEST_KEY_MAP[digest.id];
  const value = watch(`digest_frequency.${key}`) ?? '';

  return (
    <div className="flex items-center justify-between gap-4">
      <p className="text-sm font-medium text-white">{digest.label}</p>
      {isEditing ? (
        <Select
          value={value}
          onValueChange={(newValue) => setValue(`digest_frequency.${key}`, newValue as never)}
        >
          <SelectTrigger className="w-40 bg-[#FFFFFF1A] border-[#616161B2]">
            <SelectValue placeholder="Select..." />
          </SelectTrigger>
          <SelectContent>
            {DIGEST_FREQUENCY_OPTIONS_MOCK.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <span className="text-sm text-[#FFFFFFCC]">{value}</span>
      )}
    </div>
  );
}
