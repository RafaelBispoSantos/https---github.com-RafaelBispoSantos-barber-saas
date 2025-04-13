import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ThemeProvider";

const PERIODS = {
  WEEK: "week",
  MONTH: "month",
  YEAR: "year"
};

// Formata os valores de moeda para reais
const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

// Customiza o tooltip do gráfico
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-popover border shadow-md rounded-md p-3 text-sm">
        <p className="font-medium">{label}</p>
        <p className="text-primary font-semibold mt-1">
          {formatCurrency(payload[0].value)}
        </p>
      </div>
    );
  }

  return null;
};

export default function Revenue({ data = [] }) {
  const [period, setPeriod] = useState(PERIODS.MONTH);
  const { theme } = useTheme();
  
  // Determina as cores com base no tema
  const colors = {
    bar: theme === "dark" ? "#38bdf8" : "#0284c7",
    grid: theme === "dark" ? "#374151" : "#e5e7eb",
    text: theme === "dark" ? "#9ca3af" : "#6b7280"
  };

  // Filtra e formata os dados com base no período selecionado
  const getFilteredData = () => {
    const now = new Date();
    let filteredData = [...data];
    
    if (period === PERIODS.WEEK) {
      // Últimos 7 dias
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(now.getDate() - 7);
      filteredData = data.filter(item => new Date(item.date) >= oneWeekAgo);
    } else if (period === PERIODS.MONTH) {
      // Último mês (últimos 30 dias)
      const oneMonthAgo = new Date();
      oneMonthAgo.setDate(now.getDate() - 30);
      filteredData = data.filter(item => new Date(item.date) >= oneMonthAgo);
    }
    // Para YEAR, usamos todos os dados
    
    return filteredData;
  };
  
  // Formatar o label do eixo X conforme o período
  const formatXAxis = (value) => {
    const date = new Date(value);
    
    if (period === PERIODS.WEEK) {
      // Mostra o dia da semana para período semanal
      return new Intl.DateTimeFormat('pt-BR', { weekday: 'short' }).format(date);
    } else if (period === PERIODS.MONTH) {
      // Mostra o dia do mês para período mensal
      return date.getDate();
    } else {
      // Mostra o mês abreviado para período anual
      return new Intl.DateTimeFormat('pt-BR', { month: 'short' }).format(date);
    }
  };

  return (
    <div className="rounded-lg border bg-card">
      <div className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <h3 className="font-heading font-medium text-lg">Faturamento</h3>
          
          <div className="flex space-x-2 mt-3 sm:mt-0">
            <Button
              variant={period === PERIODS.WEEK ? "default" : "outline"}
              size="sm"
              onClick={() => setPeriod(PERIODS.WEEK)}
            >
              Semana
            </Button>
            <Button
              variant={period === PERIODS.MONTH ? "default" : "outline"}
              size="sm"
              onClick={() => setPeriod(PERIODS.MONTH)}
            >
              Mês
            </Button>
            <Button
              variant={period === PERIODS.YEAR ? "default" : "outline"}
              size="sm"
              onClick={() => setPeriod(PERIODS.YEAR)}
            >
              Ano
            </Button>
          </div>
        </div>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={getFilteredData()}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 20,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} vertical={false} />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatXAxis}
                tick={{ fill: colors.text, fontSize: 12 }}
                axisLine={{ stroke: colors.grid }}
                tickLine={{ stroke: colors.grid }}
              />
              <YAxis 
                tickFormatter={(value) => `R$${value}`}
                tick={{ fill: colors.text, fontSize: 12 }}
                axisLine={{ stroke: colors.grid }}
                tickLine={{ stroke: colors.grid }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar 
                dataKey="value" 
                name="Faturamento" 
                fill={colors.bar} 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}