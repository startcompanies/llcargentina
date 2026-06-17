'use client';

import { useState } from 'react';
import styles from './FaqEditor.module.css';

type FaqItem = { question: string; answer: string };

type FaqEditorProps = {
  value: string;
  onChange: (value: string) => void;
};

function parseItems(value: string): FaqItem[] {
  try {
    const parsed = JSON.parse(value || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function FaqEditor({ value, onChange }: FaqEditorProps) {
  const [items, setItems] = useState<FaqItem[]>(() => parseItems(value));

  function update(nextItems: FaqItem[]) {
    setItems(nextItems);
    onChange(JSON.stringify(nextItems));
  }

  function addItem() {
    update([...items, { question: '', answer: '' }]);
  }

  function removeItem(index: number) {
    update(items.filter((_, i) => i !== index));
  }

  function setQuestion(index: number, question: string) {
    update(items.map((item, i) => (i === index ? { ...item, question } : item)));
  }

  function setAnswer(index: number, answer: string) {
    update(items.map((item, i) => (i === index ? { ...item, answer } : item)));
  }

  return (
    <div className={styles.editor}>
      <p className={styles.hint}>
        Cada pregunta y respuesta aparecerá en el artículo con schema markup <code>FAQPage</code> para SEO.
      </p>

      {items.length === 0 ? (
        <p className={styles.empty}>Sin preguntas todavía. Agregá la primera.</p>
      ) : (
        <ol className={styles.list}>
          {items.map((item, index) => (
            <li key={index} className={styles.item}>
              <div className={styles.itemHeader}>
                <span className={styles.itemNumber}>#{index + 1}</span>
                <button
                  type="button"
                  className={styles.removeButton}
                  onClick={() => removeItem(index)}
                >
                  Eliminar
                </button>
              </div>
              <label className={styles.field}>
                <span>Pregunta</span>
                <input
                  type="text"
                  value={item.question}
                  onChange={(e) => setQuestion(index, e.target.value)}
                  placeholder="¿Cuánto cuesta abrir una LLC?"
                />
              </label>
              <label className={styles.field}>
                <span>Respuesta</span>
                <textarea
                  value={item.answer}
                  onChange={(e) => setAnswer(index, e.target.value)}
                  rows={3}
                  placeholder="El costo varía entre $50 y $500 dependiendo del estado..."
                />
              </label>
            </li>
          ))}
        </ol>
      )}

      <button type="button" className={styles.addButton} onClick={addItem}>
        + Agregar pregunta
      </button>
    </div>
  );
}
