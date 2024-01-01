import { MonitorIcon, SmartphoneIcon, TabletIcon } from 'lucide-react'

export type Device = 'desktop' | 'tablet' | 'mobile'

export const DEVICES: Device[] = ['desktop', 'tablet', 'mobile']
export const DEVICE_CONFIG: Record<
  Device,
  { label: string; icon: React.ReactElement<{ className?: string; style?: React.CSSProperties }>; deviceSize: number }
> = {
  desktop: { label: 'Desktop', icon: <MonitorIcon />, deviceSize: 1440 },
  tablet: { label: 'Tablet', icon: <TabletIcon />, deviceSize: 768 },
  mobile: { label: 'Mobile', icon: <SmartphoneIcon />, deviceSize: 480 },
}
