import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { performanceStatus } from '../types/grade'

export type GradesChartItem = {
  name: string
  average: number
}

const STATUS_COLORS = {
  aprovado: '#15803d',
  recuperacao: '#b45309',
  reprovado: '#b91c1c',
  'sem-nota': '#9ca3af',
} as const

const PASSING_AVERAGE = 7

export default function GradesChart({ items }: { items: GradesChartItem[] }) {
  if (items.length === 0) return null

  return (
    <figure className="grades-chart">
      <figcaption>Média por aluno</figcaption>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={items} margin={{ top: 8, right: 8, bottom: 8, left: -16 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(124, 58, 237, 0.14)" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 12, fill: '#6b5a8a' }}
            tickLine={false}
            interval={0}
            tickFormatter={(value: string) => (value.length > 10 ? `${value.slice(0, 9)}…` : value)}
          />
          <YAxis domain={[0, 10]} tick={{ fontSize: 12, fill: '#6b5a8a' }} tickLine={false} />
          <Tooltip
            cursor={{ fill: 'rgba(124, 58, 237, 0.06)' }}
            formatter={(value) => [String(value), 'Média']}
          />
          <ReferenceLine
            y={PASSING_AVERAGE}
            stroke="#7c3aed"
            strokeDasharray="4 4"
            label={{ value: 'Aprovação (7)', position: 'insideTopRight', fontSize: 11, fill: '#7c3aed' }}
          />
          <Bar dataKey="average" radius={[6, 6, 0, 0]} maxBarSize={44}>
            {items.map((item, index) => (
              <Cell key={`${item.name}-${index}`} fill={STATUS_COLORS[performanceStatus(item.average)]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </figure>
  )
}
