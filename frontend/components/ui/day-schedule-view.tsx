'use client';

import { X, Plus } from 'lucide-react';
import { useState } from 'react';

interface DayEvent {
  id: string;
  title: string;
  startTime: string; // formato HH:mm
  endTime: string; // formato HH:mm
  color?: string;
}

interface DayScheduleViewProps {
  date: Date;
  events: DayEvent[];
  onClose: () => void;
  onTimeSlotClick: (hour: number) => void;
  onEventClick: (event: DayEvent) => void;
}

export function DayScheduleView({
  date,
  events,
  onClose,
  onTimeSlotClick,
  onEventClick,
}: DayScheduleViewProps) {
  const hours = Array.from({ length: 11 }, (_, i) => i + 8); // 8h às 18h

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const weekDays = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

  const getEventsForHour = (hour: number) => {
    return events.filter((event) => {
      const eventStart = parseInt(event.startTime.split(':')[0]);
      const eventEnd = parseInt(event.endTime.split(':')[0]);
      return hour >= eventStart && hour < eventEnd;
    });
  };

  const formatDate = () => {
    return `${weekDays[date.getDay()]}, ${date.getDate()} de ${monthNames[date.getMonth()]} de ${date.getFullYear()}`;
  };

  const isPastDateTime = (hour: number) => {
    const now = new Date();
    const checkDateTime = new Date(date);
    checkDateTime.setHours(hour, 0, 0, 0);
    return checkDateTime < now;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-200">
          <div className="min-w-0 pr-2">
            <h2 className="text-lg sm:text-2xl font-bold text-slate-900">Agenda do Dia</h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 truncate">{formatDate()}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors flex-shrink-0"
          >
            <X size={24} className="text-slate-600" />
          </button>
        </div>

        {/* Timeline */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6">
          <div className="space-y-0 border border-slate-200 rounded-lg overflow-hidden">
            {hours.map((hour) => {
              const hourEvents = getEventsForHour(hour);
              const hasEvents = hourEvents.length > 0;
              const isPast = isPastDateTime(hour);

              return (
                <div
                  key={hour}
                  className={`flex border-b last:border-b-0 border-slate-200 ${
                    hasEvents ? 'bg-slate-50' : 'bg-white hover:bg-slate-50'
                  } transition-colors`}
                >
                  {/* Time Column */}
                  <div className="w-16 sm:w-24 p-2 sm:p-4 border-r border-slate-200 flex items-start flex-shrink-0">
                    <span className={`text-xs sm:text-sm font-medium ${
                      isPast ? 'text-slate-500' : 'text-slate-700'
                    }`}>
                      {hour.toString().padStart(2, '0')}:00
                    </span>
                  </div>

                  {/* Events Column */}
                  <div className="flex-1 p-2 sm:p-4 min-h-[60px] sm:min-h-[80px] relative">
                    <div className="space-y-2">
                      {hourEvents.map((event) => (
                        <div
                          key={event.id}
                          onClick={() => onEventClick(event)}
                          className={`p-2 sm:p-3 rounded-lg cursor-pointer hover:opacity-90 transition-opacity ${
                            event.color || 'bg-blue-200 text-blue-800'
                          }`}
                        >
                          <div className="font-medium text-xs sm:text-sm break-words">{event.title}</div>
                          <div className="text-[10px] sm:text-xs opacity-90 mt-1">
                            {event.startTime} - {event.endTime}
                          </div>
                        </div>
                      ))}
                      {/* Botão de adicionar apenas para horários futuros */}
                      {!isPast && (
                        <button
                          onClick={() => onTimeSlotClick(hour)}
                          className="w-full p-2 border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:border-slate-400 transition-colors group"
                        >
                          <Plus size={16} className="sm:size-18 group-hover:scale-110 transition-transform" />
                          <span className="ml-1 sm:ml-2 text-xs sm:text-sm">Adicionar</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-6 border-t border-slate-200 bg-slate-50">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="w-3 h-3 rounded bg-blue-200"></div>
                <span className="text-slate-600">Agendado</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="w-3 h-3 rounded bg-purple-200"></div>
                <span className="text-slate-600">Confirmado</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="w-3 h-3 rounded bg-green-200"></div>
                <span className="text-slate-600">Concluído</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="w-3 h-3 rounded bg-red-200"></div>
                <span className="text-slate-600">Cancelado</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
