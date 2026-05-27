// @ts-nocheck
import React, { useState, useCallback, useEffect } from 'react';
import { Clock, Save, X, Check, Sparkles, ChevronLeft, Thermometer, Heart, Wind, Droplets, Activity, AlertTriangle, TrendingUp, TrendingDown, Minus, FileText, Plus, Trash2 } from 'lucide-react';
import { COMPLAINT_LABELS } from './types';
import { getInitialDailyState } from './mockRoundData';
import { usePatientData } from 'context/PatientDataContext';
import {
  Pill,
  CheckBtn,
  FormInput,
  FormLabel,
  WardRoundRoot,
  FormBlock,
  FormBlockHeader,
  FormBlockBody,
  PillGroup,
  DailyHeader,
  HeaderBackBtn,
  HeaderLeftSection,
  HeaderTitle,
  HeaderSubtitle,
  HeaderButtonsGroup,
  VitalsGridWrapper,
  VitalItemWrapper,
  VitalItemHeader,
  VitalItemLabel,
  VitalItemUnit,
  CheckboxSpan,
  FeverBox,
  DynamicsCommentWrapper,
  TreatmentTableWrapper,
  TreatmentTable,
  RadioButton,
  RadioDot,
  ErrorNotFoundBox,
  PatientNotFoundText,
  PageContentScroll,
  ComplaintsGroup,
  ObjectiveSectionGrid,
  ObjectiveSectionCard,
  ObjectiveSectionCardTitle,
  ObjectiveSectionCardContent,
  RespiratoryNoteInput,
  HeaderDraftBtn,
  HeaderCompleteBtn,
  HeaderCloseBtn,
  TemperatureSheetBtn,
  ModalOverlayBackground,
  ModalContent,
  ModalTitle,
  ModalFieldsGrid,
  ModalFieldsGrid2,
  ModalButtonsGroup,
  ModalCancelBtn,
  ModalAddBtn,
  ToastOverlay2,
  DynamicsButtonsGroup,
  DynamicsButton,
  GeneratedTextBlock,
  GenerateButtonContainer,
  GenerateButton,
  GenerateButtonHint,
  CopyResultBtn,
  AddPrescriptionBtn,
  DeletePrescBtn,
  WardRoundPageInline1
} from './styled';

interface DailyRoundPageProps {
  patientId: string;
  onClose: () => void;
  onNavigateToTemperatureSheet?: (patientId: string) => void;
}

// ─── Функция генерации текста осмотра ───────────────────────────────────────

const generateDailyText = (form: any, patientName: string): string => {
  const parts = [];
  parts.push(`ЕЖЕДНЕВНЫЙ ОСМОТР`);
  parts.push(`Пациент: ${patientName}`);
  parts.push(`Дата: ${form.inspectionDate}`);
  parts.push(`Время: ${form.inspectionTime}`);
  parts.push(`Врач: ${form.doctor}`);
  parts.push('');
  if (form.complaints && form.complaints.length > 0 && form.complaints[0] !== 'none') {
    parts.push('ЖАЛОБЫ:');
    form.complaints.forEach((c: string) => {
      const label = COMPLAINT_LABELS[c as keyof typeof COMPLAINT_LABELS] || c;
      parts.push(`  • ${label}`);
    });
    if (form.complaintsNote) {
      parts.push(`  Дополнение: ${form.complaintsNote}`);
    }
    parts.push('');
  }
  if (form.temperature || form.hr || form.bpRight || form.spo2 || form.rr) {
    parts.push('ПОКАЗАТЕЛИ ЖИЗНЕДЕЯТЕЛЬНОСТИ:');
    if (form.temperature) parts.push(`  • Температура: ${form.temperature}°C`);
    if (form.hr) parts.push(`  • ЧСС: ${form.hr} уд/мин`);
    if (form.bpRight) parts.push(`  • АД (прав.): ${form.bpRight} мм рт.ст`);
    if (form.bpLeft) parts.push(`  • АД (лев.): ${form.bpLeft} мм рт.ст`);
    if (form.rr) parts.push(`  • ЧДД: ${form.rr} в мин`);
    if (form.spo2) parts.push(`  • SpO₂: ${form.spo2}%`);
    parts.push('');
  }
  if (form.generalCondition || form.skinColor || form.chestForm) {
    parts.push('ОБЪЕКТИВНЫЙ ОСМОТР:');
    if (form.generalCondition) parts.push(`  • Общее состояние: ${form.generalCondition}`);
    if (form.skinColor) parts.push(`  • Кожа: ${form.skinColor}`);
    if (form.chestForm) parts.push(`  • Форма грудной клетки: ${form.chestForm}`);
    if (form.chestSymmetry) parts.push(`  • Симметрия: ${form.chestSymmetry}`);
    if (form.breathingType) parts.push(`  • Дыхание: ${form.breathingType}`);
    if (form.ralesType) parts.push(`  • Хрипы: ${form.ralesType}`);
    if (form.respiratoryNote) parts.push(`  • Примечание по дыхательной системе: ${form.respiratoryNote}`);
    if (form.heartRhythm) parts.push(`  • Сердечный ритм: ${form.heartRhythm}`);
    if (form.heartTones) parts.push(`  • Тоны сердца: ${form.heartTones}`);
    if (form.heartNote) parts.push(`  • Примечание по сердцу: ${form.heartNote}`);
    if (form.tongueState) parts.push(`  • Язык: ${form.tongueState}`);
    if (form.abdomenState) parts.push(`  • Живот: ${form.abdomenState}`);
    if (form.abdomenNote) parts.push(`  • Примечание по животу: ${form.abdomenNote}`);
    if (form.stool) parts.push(`  • Стул: ${form.stool}`);
    if (form.urination) parts.push(`  • Мочеиспускание: ${form.urination}`);
    parts.push('');
  }
  if (form.dynamics) {
    parts.push('ДИНАМИКА:');
    parts.push(`  • ${form.dynamics}`);
    if (form.dynamicsComment) {
      parts.push(`  • ${form.dynamicsComment}`);
    }
    parts.push('');
  }
  if (form.treatmentDecision) {
    parts.push('ЛЕЧЕНИЕ:');
    if (form.treatmentDecision === 'keep') {
      parts.push('  Оставить по листу назначений');
    } else if (form.treatmentDecision === 'modify') {
      parts.push('  Изменение назначений:');
      form.prescriptions.forEach((p: any) => {
        parts.push(`    • ${p.drug} ${p.dose}${p.unit ? ' ' + p.unit : ''} ${p.route ? '(' + p.route + ')' : ''} ${p.frequency ? p.frequency : ''} ${p.comment ? '- ' + p.comment : ''}`.trim());
      });
    }
    parts.push('');
  }
  if (form.controlStudies || form.nextInspection) {
    parts.push('ПЛАН:');
    if (form.controlStudies) parts.push(`  • Контроль: ${form.controlStudies}`);
    if (form.nextInspection) parts.push(`  • Повторный осмотр: ${form.nextInspection}`);
  }
  return parts.join('\n');
};
const DailyRoundPage: React.FC<DailyRoundPageProps> = ({
  patientId,
  onClose,
  onNavigateToTemperatureSheet
}) => {
  const {
    getPatient,
    saveInspection,
    updatePatientVitals,
    addHistoryEntry
  } = usePatientData();
  const patient = getPatient(patientId);
  const [form, setForm] = useState<any>(() => getInitialDailyState(patientId, patient));
  const [toastMsg, setToastMsg] = useState<any>(null);
  const [showResult, setShowResult] = useState(false);
  const [showPrescModal, setShowPrescModal] = useState(false);
  const [newPresc, setNewPresc] = useState<any>({});
  useEffect(() => {
    if (!toastMsg) return;
    const t = setTimeout(() => setToastMsg(null), 3000);
    return () => clearTimeout(t);
  }, [toastMsg]);
  const showToast = useCallback((text: string, type = 'info') => {
    setToastMsg({
      text,
      type
    });
  }, []);
  const setField = useCallback((key: string, value: any) => {
    setForm(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);
  const toggleComplaint = (k: string) => {
    setForm(prev => {
      const c = prev.complaints;
      if (k === 'none') return {
        ...prev,
        complaints: ['none']
      };
      const without = c.filter(x => x !== 'none');
      return {
        ...prev,
        complaints: without.includes(k) ? without.filter(x => x !== k) : [...without, k]
      };
    });
  };
  const handleGenerateAndSave = () => {
    if (!patient) return;
    const text = generateDailyText(form, `${patient.lastName} ${patient.firstName}`);
    setField('generatedText', text);
    setField('status', 'completed');
    const insp = {
      id: `daily-${Date.now()}`,
      type: 'daily',
      date: form.inspectionDate,
      time: form.inspectionTime,
      doctor: form.doctor,
      vitals: {
        temp: form.temperature,
        hr: form.hr,
        bp: form.bpRight,
        spo2: form.spo2,
        rr: form.rr
      },
      generatedText: text
    };
    saveInspection(patientId, insp);
    if (form.temperature || form.hr || form.bpRight || form.spo2 || form.rr) {
      updatePatientVitals(patientId, {
        temp: form.temperature || undefined,
        hr: form.hr || undefined,
        bp: form.bpRight || undefined,
        spo2: form.spo2 || undefined,
        resp: form.rr || undefined
      });
    }
    addHistoryEntry(patientId, {
      dateTime: `${form.inspectionDate} ${form.inspectionTime}`,
      type: 'Ежедневный осмотр',
      doctor: form.doctor,
      conclusion: text.slice(0, 200) + (text.length > 200 ? '...' : '')
    });
    setShowResult(true);
    showToast('Осмотр сохранён в карточке пациента', 'success');
  };
  const addPresc = () => {
    if (!newPresc.drug) return showToast('Укажите название препарата', 'error');
    const p = {
      id: `np-${Date.now()}`,
      drug: newPresc.drug ?? '',
      dose: newPresc.dose ?? '',
      unit: newPresc.unit ?? 'мг',
      route: newPresc.route ?? 'перорально',
      frequency: newPresc.frequency ?? '1р/д',
      form: newPresc.form ?? '',
      regimen: newPresc.regimen ?? '',
      comment: newPresc.comment ?? '',
      action: 'new'
    };
    setForm(prev => ({
      ...prev,
      prescriptions: [...prev.prescriptions, p]
    }));
    setNewPresc({});
    setShowPrescModal(false);
    showToast('Назначение добавлено', 'success');
  };
  if (!patient) return <WardRoundRoot>
        <ErrorNotFoundBox>
          <PatientNotFoundText>Пациент не найден</PatientNotFoundText>
        </ErrorNotFoundBox>
      </WardRoundRoot>;
  return <WardRoundRoot>
      <DailyHeader>
        <HeaderBackBtn onClick={onClose}>
          <ChevronLeft size={15} /> Обходы
        </HeaderBackBtn>
        <HeaderLeftSection>
          <HeaderTitle>Ежедневный осмотр</HeaderTitle>
          <HeaderSubtitle>
            {patient.lastName} {patient.firstName} {patient.middleName} · {form.inspectionDate}{' '}
            {form.inspectionTime}
          </HeaderSubtitle>
        </HeaderLeftSection>

        <HeaderButtonsGroup>
          <HeaderDraftBtn onClick={() => {
          setField('status', 'draft');
          showToast('Черновик сохранён', 'success');
        }}>
            <Save size={14} /> Черновик
          </HeaderDraftBtn>
          <HeaderCompleteBtn onClick={handleGenerateAndSave}>
            <Check size={14} /> Завершить
          </HeaderCompleteBtn>
          <HeaderCloseBtn onClick={onClose}>
            <X size={15} />
          </HeaderCloseBtn>
        </HeaderButtonsGroup>
      </DailyHeader>

      <PageContentScroll>
        <FormBlock>
          <FormBlockHeader>
            <Clock size={15} /> Информация об осмотре
          </FormBlockHeader>
          <FormBlockBody>
            <div>
              <FormLabel>Дата</FormLabel>
              <FormInput type="date" value={form.inspectionDate} onChange={e => setField('inspectionDate', e.target.value)} />
            </div>
            <div>
              <FormLabel>Время</FormLabel>
              <FormInput type="time" value={form.inspectionTime} onChange={e => setField('inspectionTime', e.target.value)} />
            </div>
            <div>
              <FormLabel>Врач</FormLabel>
              <FormInput value={form.doctor} onChange={e => setField('doctor', e.target.value)} />
            </div>
          </FormBlockBody>
        </FormBlock>

        <FormBlock>
          <FormBlockHeader>
            <Activity size={15} /> Показатели
            {onNavigateToTemperatureSheet && <TemperatureSheetBtn onClick={() => onNavigateToTemperatureSheet(patientId)}>
                Температурный лист →
              </TemperatureSheetBtn>}
          </FormBlockHeader>

          <FormBlockBody>
            <VitalsGridWrapper>
              {[{
              key: 'temperature',
              label: 'Температура',
              placeholder: '36.6',
              unit: '°C',
              icon: <Thermometer size={16} color="#3b82f6" />,
              alert: parseFloat(form.temperature) >= 38,
              type: 'number',
              min: '34',
              max: '43',
              step: '0.1'
            }, {
              key: 'hr',
              label: 'ЧСС',
              placeholder: '77',
              unit: 'уд/мин',
              icon: <Heart size={16} color="#ef4444" />,
              alert: false,
              type: 'number',
              min: '0',
              max: '300',
              step: '1'
            }, {
              key: 'bpRight',
              label: 'АД (прав.)',
              placeholder: '120/80',
              unit: 'мм рт.ст',
              icon: <Activity size={16} color="#8b5cf6" />,
              alert: false
            }, {
              key: 'bpLeft',
              label: 'АД (лев.)',
              placeholder: '120/80',
              unit: 'мм рт.ст',
              icon: <Activity size={16} color="#8b5cf6" />,
              alert: false
            }, {
              key: 'rr',
              label: 'ЧДД',
              placeholder: '18',
              unit: 'в мин',
              icon: <Wind size={16} color="#06b6d4" />,
              alert: false,
              type: 'number',
              min: '0',
              max: '60',
              step: '1'
            }, {
              key: 'spo2',
              label: 'SpO₂',
              placeholder: '98',
              unit: '%',
              icon: <Droplets size={16} color="#22c55e" />,
              alert: parseFloat(form.spo2) < 95,
              type: 'number',
              min: '0',
              max: '100',
              step: '1'
            }].map(v => <VitalItemWrapper key={v.key} $alert={v.alert}>
                  <VitalItemHeader>
                    {v.icon}
                    <VitalItemLabel>{v.label}</VitalItemLabel>
                  </VitalItemHeader>
                  <FormInput type={v.type ?? 'text'} min={v.min} max={v.max} step={v.step} placeholder={v.placeholder} value={form[v.key]} onChange={e => setField(v.key, e.target.value)} />
                  <VitalItemUnit>{v.unit}</VitalItemUnit>
                </VitalItemWrapper>)}
            </VitalsGridWrapper>
          </FormBlockBody>
        </FormBlock>

        <FormBlock>
          <FormBlockHeader>
            <FileText size={15} /> Жалобы
          </FormBlockHeader>
          <FormBlockBody>
            <ComplaintsGroup>
              {Object.keys(COMPLAINT_LABELS).map(k => <CheckBtn key={k} onClick={() => toggleComplaint(k)}>
                  <CheckboxSpan $checked={form.complaints.includes(k)}>
                    {form.complaints.includes(k) && <Check size={9} color="white" />}
                  </CheckboxSpan>
                  {COMPLAINT_LABELS[k]}
                </CheckBtn>)}
            </ComplaintsGroup>
            {form.complaints.includes('fever') && <FeverBox>
                <FormLabel>Максимальная температура (°C)</FormLabel>
                <FormInput type="number" min="34" max="43" step="0.1" placeholder="38.5" value={form.complaintParams.fever?.maxTemp ?? ''} onChange={e => setField('complaintParams', {
              ...form.complaintParams,
              fever: {
                maxTemp: e.target.value
              }
            })} />
              </FeverBox>}
            <div>
              <FormLabel>Дополнение врача</FormLabel>
              <FormInput placeholder="Уточнения..." value={form.complaintsNote} onChange={e => setField('complaintsNote', e.target.value)} />
            </div>
          </FormBlockBody>
        </FormBlock>

        <FormBlock>
          <FormBlockHeader>
            <Activity size={15} /> Объективно
          </FormBlockHeader>
          <FormBlockBody>
            <ObjectiveSectionGrid>
              <ObjectiveSectionCard>
                <ObjectiveSectionCardTitle>Общее состояние</ObjectiveSectionCardTitle>
                <ObjectiveSectionCardContent>
                  {[['satisfactory', 'Удовлетворительное', 'green'], ['moderate', 'Средней тяжести', 'orange'], ['severe', 'Тяжёлое', 'red']].map(([val, lbl, c]) => <Pill key={val} onClick={() => setField('generalCondition', form.generalCondition === val ? null : val)}>
                      {lbl}
                    </Pill>)}
                </ObjectiveSectionCardContent>
              </ObjectiveSectionCard>

              <ObjectiveSectionCard>
                <ObjectiveSectionCardTitle>Кожа</ObjectiveSectionCardTitle>
                <ObjectiveSectionCardContent>
                  {[['pale_pink', 'Бледно-розовая', 'green'], ['pale', 'Бледная', 'blue'], ['hyperemia', 'Гиперемия', 'orange'], ['cyanosis', 'Цианоз', 'blue'], ['icteric', 'Иктеричная', 'orange']].map(([val, lbl, c]) => <Pill key={val} onClick={() => setField('skinColor', form.skinColor === val ? null : val)}>
                      {lbl}
                    </Pill>)}
                </ObjectiveSectionCardContent>
              </ObjectiveSectionCard>

              <ObjectiveSectionCard>
                <ObjectiveSectionCardTitle>Грудная клетка</ObjectiveSectionCardTitle>
                <ObjectiveSectionCardContent>
                  {[['normosthenic', 'Нормостеническая'], ['hypersthenic', 'Гиперстеническая'], ['asthenic', 'Астеническая'], ['emphysematous', 'Эмфизематозная']].map(([val, lbl]) => <Pill key={val} onClick={() => setField('chestForm', form.chestForm === val ? null : val)}>
                      {lbl}
                    </Pill>)}
                  <PillGroup>
                    {[['symmetric', 'Симметричная', 'green'], ['asymmetric', 'Асимметричная', 'orange']].map(([val, lbl, c]) => <Pill key={val} onClick={() => setField('chestSymmetry', form.chestSymmetry === val ? null : val)}>
                        {lbl}
                      </Pill>)}
                  </PillGroup>
                </ObjectiveSectionCardContent>
              </ObjectiveSectionCard>

              <ObjectiveSectionCard>
                <ObjectiveSectionCardTitle>Дыхание</ObjectiveSectionCardTitle>
                <ObjectiveSectionCardContent>
                  <PillGroup>
                    {[['vesicular', 'Везикулярное', 'green'], ['harsh', 'Жёсткое', 'orange'], ['weakened', 'Ослабленное', 'blue']].map(([val, lbl, c]) => <Pill key={val} onClick={() => setField('breathingType', form.breathingType === val ? null : val)}>
                        {lbl}
                      </Pill>)}
                  </PillGroup>
                  <RespiratoryNoteInput>Хрипы</RespiratoryNoteInput>
                  <PillGroup>
                    {[['none', 'Нет', 'green'], ['dry', 'Сухие', 'orange'], ['moist', 'Влажные', 'blue']].map(([val, lbl, c]) => <Pill key={val} onClick={() => setField('ralesType', form.ralesType === val ? null : val)}>
                        {lbl}
                      </Pill>)}
                  </PillGroup>
                  <FormInput placeholder="Доп. данные..." value={form.respiratoryNote} onChange={e => setField('respiratoryNote', e.target.value)} />
                </ObjectiveSectionCardContent>
              </ObjectiveSectionCard>

              <ObjectiveSectionCard>
                <ObjectiveSectionCardTitle>Сердце</ObjectiveSectionCardTitle>
                <ObjectiveSectionCardContent>
                  <PillGroup>
                    {[['regular', 'Ритмичное', 'green'], ['irregular', 'Аритмия', 'red']].map(([val, lbl, c]) => <Pill key={val} onClick={() => setField('heartRhythm', form.heartRhythm === val ? null : val)}>
                        {lbl}
                      </Pill>)}
                  </PillGroup>
                  <PillGroup>
                    {[['clear', 'Тоны ясные', 'green'], ['muffled', 'Приглушены', 'orange'], ['deaf', 'Глухие', 'red']].map(([val, lbl, c]) => <Pill key={val} onClick={() => setField('heartTones', form.heartTones === val ? null : val)}>
                        {lbl}
                      </Pill>)}
                  </PillGroup>
                  <FormInput placeholder="Комментарий..." value={form.heartNote} onChange={e => setField('heartNote', e.target.value)} />
                </ObjectiveSectionCardContent>
              </ObjectiveSectionCard>

              <ObjectiveSectionCard>
                <ObjectiveSectionCardTitle>Язык</ObjectiveSectionCardTitle>
                <ObjectiveSectionCardContent>
                  {[['moist_clean', 'Влажный, чистый', 'green'], ['moist_coated', 'Влажный, обложен', 'orange'], ['dry_clean', 'Сухой, чистый', 'orange'], ['dry_coated', 'Сухой, обложен', 'red']].map(([val, lbl, c]) => <Pill key={val} onClick={() => setField('tongueState', form.tongueState === val ? null : val)}>
                      {lbl}
                    </Pill>)}
                </ObjectiveSectionCardContent>
              </ObjectiveSectionCard>

              <ObjectiveSectionCard>
                <ObjectiveSectionCardTitle>Живот</ObjectiveSectionCardTitle>
                <ObjectiveSectionCardContent>
                  <PillGroup>
                    {[['soft', 'Мягкий, б/б', 'green'], ['tense', 'Напряжён', 'red'], ['bloated', 'Вздут', 'orange']].map(([val, lbl, c]) => <Pill key={val} onClick={() => setField('abdomenState', form.abdomenState === val ? null : val)}>
                        {lbl}
                      </Pill>)}
                  </PillGroup>
                  <FormInput placeholder="Комментарий..." value={form.abdomenNote} onChange={e => setField('abdomenNote', e.target.value)} />
                </ObjectiveSectionCardContent>
              </ObjectiveSectionCard>

              <ObjectiveSectionCard>
                <ObjectiveSectionCardTitle>Стул</ObjectiveSectionCardTitle>
                <ObjectiveSectionCardContent>
                  {[['normal', 'Норм., регулярный', 'green'], ['constipation', 'Задержка', 'orange'], ['diarrhea', 'Жидкий', 'red'], ['absent', 'Нет', 'red']].map(([val, lbl, c]) => <Pill key={val} onClick={() => setField('stool', form.stool === val ? null : val)}>
                      {lbl}
                    </Pill>)}
                </ObjectiveSectionCardContent>
              </ObjectiveSectionCard>

              <ObjectiveSectionCard>
                <ObjectiveSectionCardTitle>Мочеиспускание</ObjectiveSectionCardTitle>
                <ObjectiveSectionCardContent>
                  {[['free_painless', 'Свободное, б/б', 'green'], ['difficult', 'Затруднено', 'orange'], ['painful', 'Болезненное', 'red'], ['frequent', 'Учащённое', 'orange']].map(([val, lbl, c]) => <Pill key={val} onClick={() => setField('urination', form.urination === val ? null : val)}>
                      {lbl}
                    </Pill>)}
                </ObjectiveSectionCardContent>
              </ObjectiveSectionCard>
            </ObjectiveSectionGrid>
          </FormBlockBody>
        </FormBlock>

        <FormBlock>
          <FormBlockHeader>
            <TrendingUp size={15} /> Динамика
          </FormBlockHeader>
          <FormBlockBody>
            <DynamicsButtonsGroup>
              {[['improvement', 'Улучшение', 'green', TrendingUp], ['no_change', 'Стабильно', 'blue', Minus], ['deterioration', 'Ухудшение', 'red', TrendingDown]].map(([val, lbl, c, Icon]) => <DynamicsButton key={val} $active={form.dynamics === val} $color={c as 'green' | 'blue' | 'red'} onClick={() => setField('dynamics', form.dynamics === val ? null : val)}>
                  <Icon size={13} /> {lbl}
                </DynamicsButton>)}
            </DynamicsButtonsGroup>
            <DynamicsCommentWrapper>
              <FormLabel>Комментарий к динамике</FormLabel>
              <FormInput placeholder="Состояние улучшается на фоне проводимой терапии..." value={form.dynamicsComment} onChange={e => setField('dynamicsComment', e.target.value)} />
            </DynamicsCommentWrapper>
          </FormBlockBody>
        </FormBlock>

        <FormBlock>
          <FormBlockHeader>Лечение</FormBlockHeader>
          <FormBlockBody>
            <PillGroup>
              <CheckBtn onClick={() => setField('treatmentDecision', 'keep')}>
                <RadioButton $checked={form.treatmentDecision === 'keep'}>
                  {form.treatmentDecision === 'keep' && <RadioDot />}
                </RadioButton>
                Оставить по листу назначений
              </CheckBtn>

              <CheckBtn onClick={() => setField('treatmentDecision', 'modify')}>
                <RadioButton $checked={form.treatmentDecision === 'modify'}>
                  {form.treatmentDecision === 'modify' && <RadioDot />}
                </RadioButton>
                Изменить
              </CheckBtn>
            </PillGroup>
            {form.treatmentDecision === 'modify' && <TreatmentTableWrapper>
                <TreatmentTable>
                  <thead>
                    <tr>
                      {['Препарат', 'Доза', 'Ед.', 'Путь', 'Кратность', 'Комментарий', ''].map(h => <th key={h}>{h}</th>)}
                    </tr>
                  </thead>

                  <tbody>
                    {form.prescriptions.map(p => <tr key={p.id}>
                        <td>
                          <FormInput value={p.drug} onChange={e => setForm(prev => ({
                      ...prev,
                      prescriptions: prev.prescriptions.map(x => x.id === p.id ? {
                        ...x,
                        drug: e.target.value
                      } : x)
                    }))} />
                        </td>
                        <td>
                          <FormInput value={p.dose} onChange={e => setForm(prev => ({
                      ...prev,
                      prescriptions: prev.prescriptions.map(x => x.id === p.id ? {
                        ...x,
                        dose: e.target.value
                      } : x)
                    }))} />
                        </td>
                        <td>
                          <FormInput value={p.unit} onChange={e => setForm(prev => ({
                      ...prev,
                      prescriptions: prev.prescriptions.map(x => x.id === p.id ? {
                        ...x,
                        unit: e.target.value
                      } : x)
                    }))} />
                        </td>
                        <td>
                          <FormInput value={p.route} onChange={e => setForm(prev => ({
                      ...prev,
                      prescriptions: prev.prescriptions.map(x => x.id === p.id ? {
                        ...x,
                        route: e.target.value
                      } : x)
                    }))} />
                        </td>
                        <td>
                          <FormInput value={p.frequency} onChange={e => setForm(prev => ({
                      ...prev,
                      prescriptions: prev.prescriptions.map(x => x.id === p.id ? {
                        ...x,
                        frequency: e.target.value
                      } : x)
                    }))} />
                        </td>
                        <td>
                          <FormInput value={p.comment ?? ''} onChange={e => setForm(prev => ({
                      ...prev,
                      prescriptions: prev.prescriptions.map(x => x.id === p.id ? {
                        ...x,
                        comment: e.target.value
                      } : x)
                    }))} placeholder="—" />
                        </td>
                        <td>
                          <DeletePrescBtn onClick={() => setForm(prev => ({
                      ...prev,
                      prescriptions: prev.prescriptions.filter(x => x.id !== p.id)
                    }))}>
                            <Trash2 size={14} />
                          </DeletePrescBtn>
                        </td>
                      </tr>)}
                  </tbody>
                </TreatmentTable>

                <AddPrescriptionBtn onClick={() => setShowPrescModal(true)}>
                  <Plus size={14} /> Добавить назначение
                </AddPrescriptionBtn>
              </TreatmentTableWrapper>}
          </FormBlockBody>
        </FormBlock>

        <FormBlock>
          <FormBlockHeader>План</FormBlockHeader>
          <FormBlockBody>
            <div>
              <FormLabel>Контроль исследований</FormLabel>
              <FormInput placeholder="\u0424\u0413 \u041E\u0413\u041A \u043A\u043E\u043D\u0442\u0440\u043E\u043B\u044C \u043D\u0430 28.05.2026..." value={form.controlStudies} onChange={e => setField('controlStudies', e.target.value)} />
            </div>
            <div>
              <FormLabel>Повторный осмотр</FormLabel>
              <FormInput placeholder="\u0417\u0430\u0432\u0442\u0440\u0430 \u0432 10:00..." value={form.nextInspection} onChange={e => setField('nextInspection', e.target.value)} />
            </div>
          </FormBlockBody>
        </FormBlock>
        {showResult && form.generatedText ? <FormBlock>
            <FormBlockHeader>
              <FileText size={15} color="#059669" /> Запись осмотра сформирована и сохранена
              <CopyResultBtn onClick={() => {
            navigator.clipboard.writeText(form.generatedText);
            showToast('Текст скопирован', 'success');
          }}>
                Копировать
              </CopyResultBtn>
            </FormBlockHeader>

            <FormBlockBody>
              <GeneratedTextBlock>{form.generatedText}</GeneratedTextBlock>
            </FormBlockBody>
          </FormBlock> : <GenerateButtonContainer>
            <GenerateButton onClick={handleGenerateAndSave}>
              <Sparkles size={18} /> Сформировать запись осмотра
            </GenerateButton>
            <GenerateButtonHint>Текст будет сохранён в истории пациента</GenerateButtonHint>
          </GenerateButtonContainer>}
      </PageContentScroll>
      {showPrescModal && <ModalOverlayBackground onClick={() => setShowPrescModal(false)}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <ModalTitle>Добавить назначение</ModalTitle>
            <ModalFieldsGrid>
              <div>
                <FormLabel>Препарат *</FormLabel>
                <FormInput placeholder="Цефтриаксон" value={newPresc.drug ?? ''} onChange={e => setNewPresc(p => ({
              ...p,
              drug: e.target.value
            }))} />
              </div>
              <div>
                <FormLabel>Доза</FormLabel>
                <FormInput placeholder="1.0" value={newPresc.dose ?? ''} onChange={e => setNewPresc(p => ({
              ...p,
              dose: e.target.value
            }))} />
              </div>
              <div>
                <FormLabel>Единицы</FormLabel>
                <FormInput placeholder="г" value={newPresc.unit ?? ''} onChange={e => setNewPresc(p => ({
              ...p,
              unit: e.target.value
            }))} />
              </div>
            </ModalFieldsGrid>
            <ModalFieldsGrid2>
              <div>
                <FormLabel>Путь введения</FormLabel>
                <FormInput placeholder="в/в" value={newPresc.route ?? ''} onChange={e => setNewPresc(p => ({
              ...p,
              route: e.target.value
            }))} />
              </div>
              <div>
                <FormLabel>Кратность</FormLabel>
                <FormInput placeholder="2р/д" value={newPresc.frequency ?? ''} onChange={e => setNewPresc(p => ({
              ...p,
              frequency: e.target.value
            }))} />
              </div>
              <div>
                <FormLabel>Форма</FormLabel>
                <FormInput placeholder="р-р д/инф." value={newPresc.form ?? ''} onChange={e => setNewPresc(p => ({
              ...p,
              form: e.target.value
            }))} />
              </div>
            </ModalFieldsGrid2>
            <WardRoundPageInline1>
              <FormLabel>Комментарий</FormLabel>
              <FormInput placeholder="Развести в 200 мЛ NaCl 0.9%..." value={newPresc.comment ?? ''} onChange={e => setNewPresc(p => ({
            ...p,
            comment: e.target.value
          }))} />
            </WardRoundPageInline1>
            <ModalButtonsGroup>
              <ModalCancelBtn onClick={() => setShowPrescModal(false)}>
                Отмена
              </ModalCancelBtn>
              <ModalAddBtn onClick={addPresc}>
                Добавить
              </ModalAddBtn>
            </ModalButtonsGroup>
          </ModalContent>
        </ModalOverlayBackground>}
      {toastMsg && <ToastOverlay2 $type={toastMsg.type}>
          {toastMsg.type === 'success' ? <Check size={18} /> : <AlertTriangle size={18} />}
          {toastMsg.text}
        </ToastOverlay2>}
    </WardRoundRoot>;
};
export default DailyRoundPage;
