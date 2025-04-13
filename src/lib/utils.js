import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Função para combinar classes CSS com suporte a Tailwind CSS
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Formatação de valores para moeda brasileira (R$)
export function formatCurrency(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

// Formatação de data para o formato brasileiro
export function formatDate(date, options = {}) {
  if (!date) return "";
  
  const dateObj = typeof date === "string" ? new Date(date) : date;
  
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    ...options,
  }).format(dateObj);
}

// Gera iniciais a partir de um nome
export function getInitials(name) {
  if (!name) return "";
  
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
}

// Formata número de telefone: (XX) XXXXX-XXXX
export function formatPhone(phone) {
  if (!phone) return "";
  
  // Remove caracteres não numéricos
  const digits = phone.replace(/\D/g, "");
  
  if (digits.length === 11) {
    return `(${digits.substring(0, 2)}) ${digits.substring(
      2,
      7
    )}-${digits.substring(7)}`;
  } else if (digits.length === 10) {
    return `(${digits.substring(0, 2)}) ${digits.substring(
      2,
      6
    )}-${digits.substring(6)}`;
  }
  
  return phone;
}

// Trunca o texto com reticências
export function truncateText(text, maxLength) {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

// Verifica se um objeto está vazio
export function isEmptyObject(obj) {
  return Object.keys(obj).length === 0;
}

// Gera um ID único
export function generateId(prefix = "") {
  return `${prefix}${Math.random().toString(36).substring(2, 9)}`;
}

// Deep clone de objetos
export function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}