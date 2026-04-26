import { useState, useMemo } from 'react'
import {
  SlidersHorizontal, RotateCcw, Pencil, Trash2,
  ChevronLeft, ChevronRight, Plus, Save, Users, User,
  Shield, Lock
} from 'lucide-react'

import {
  PageWrapper,
  TwoColLayout,
  PageTopRow,
  PageTitleBlock,
  PageTitle,
  PageSubtitle,
  StatsBadgesRow,
  StatBadge,
  StatBadgeLabel,
  StatBadgeValue,
  FilterBar,
  FilterIcon,
  FilterSelect,
  SearchInput,
  ResetBtn,
  TableWrap,
  Table,
  Thead,
  Th,
  Tbody,
  Tr,
  Td,
  TdBold,
  TdMuted,
  TypeBadge,
  GenderCell,
  BedCountCell,
  BedCountNum,
  BedCountUnit,
  PriorityWrap,
  PriorityBar,
  ActionCell,
  ActionIconBtn,
  PaginationRow,
  PaginationInfo,
  PaginationBtns,
  PageBtn,
  EditorPanel,
  EditorTitle,
  EditorSubtitle,
  Divider,
  FormRow,
  FormGroup,
  FormLabel,
  FormInput,
  FormSelect,
  RadioGroup,
  RadioLabel,
  SliderRow,
  SliderLabel,
  PriorityBadge,
  PriorityLevelLabel,
  RangeInput,
  BedsMgmtHeader,
  BedsMgmtTitle,
  AddBedBtn,
  BedsList,
  BedItem,
  BedTag,
  BedInfo,
  BedName,
  BedId,
  BedStatus,
  BedDeleteBtn,
  EditorFooter,
  SaveBtn,
  ResetEditorBtn,
} from './styled'

type RoomType   = 'Обычная' | 'Реанимация' | 'Изолятор'
type GenderType = 'Мужская' | 'Женская' | 'Смешанная (Mixed)'

interface BedEntry { id: number; name: string; status: string }

interface Room {
  id: string
  floor: number
  number: string
  type: RoomType
  gender: GenderType
  beds: BedEntry[]
  priority: number
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_ROOMS: Room[] = [
  { id:'r1', floor:3, number:'301', type:'Обычная',    gender:'Мужская',           priority:1, beds:[{id:1,name:'Койко-место #1',status:'Свободно'},{id:2,name:'Койко-место #2',status:'Свободно'}] },
  { id:'r2', floor:3, number:'302', type:'Обычная',    gender:'Женская',           priority:2, beds:[{id:1,name:'Койко-место #1',status:'Свободно'},{id:2,name:'Койко-место #2',status:'Занято'}] },
  { id:'r3', floor:4, number:'401-R',type:'Реанимация',gender:'Смешанная (Mixed)', priority:5, beds:[{id:1,name:'Койко-место #1',status:'Занято'},{id:2,name:'Койко-место #2',status:'Занято'},{id:3,name:'Койко-место #3',status:'Занято'}] },
  { id:'r4', floor:2, number:'205-I',type:'Изолятор',  gender:'Смешанная (Mixed)', priority:3, beds:[{id:1,name:'Койко-место #1',status:'Свободно'}] },
  { id:'r5', floor:3, number:'308', type:'Обычная',    gender:'Мужская',           priority:1, beds:[{id:1,name:'Койко-место #1',status:'Свободно'},{id:2,name:'Койко-место #2',status:'Свободно'}] },
  { id:'r6', floor:1, number:'101', type:'Обычная',    gender:'Женская',           priority:2, beds:[{id:1,name:'Койко-место #1',status:'Свободно'},{id:2,name:'Койко-место #2',status:'Свободно'},{id:3,name:'Койко-место #3',status:'Занято'}] },
  { id:'r7', floor:1, number:'102', type:'Обычная',    gender:'Мужская',           priority:1, beds:[{id:1,name:'Койко-место #1',status:'Свободно'}] },
  { id:'r8', floor:2, number:'201', type:'Обычная',    gender:'Женская',           priority:2, beds:[{id:1,name:'Койко-место #1',status:'Занято'},{id:2,name:'Койко-место #2',status:'Свободно'}] },
]

const PAGE_SIZE = 5

const PRIORITY_LABELS: Record<number, string> = {
  1: 'Низкий', 2: 'Средний', 3: 'Средний', 4: 'Высокий', 5: 'Критичный'
}

const FLOORS  = Array.from(new Set(MOCK_ROOMS.map(r => r.floor))).sort((a,b) => a-b)
const TYPES: RoomType[] = ['Обычная', 'Реанимация', 'Изолятор']

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getGenderIcon = (g: GenderType) => {
  if (g === 'Мужская')  return <User  size={14} color="#3b82f6" />
  if (g === 'Женская')  return <User  size={14} color="#ec4899" />
  return <Users size={14} color="#9ca3af" />
}

// ─── Component ────────────────────────────────────────────────────────────────

export function WardAdmin() {
  // ── Filter state ────────────────────────────────────────────────────────────
  const [floorFilter, setFloorFilter] = useState<string>('all')
  const [typeFilter,  setTypeFilter]  = useState<string>('all')
  const [search,      setSearch]      = useState('')
  const [page,        setPage]        = useState(1)

  // ── Selected room for editor ─────────────────────────────────────────────────
  const [selectedId, setSelectedId] = useState<string>('r1')

  // ── Editor form state (mirrors selected room) ────────────────────────────────
  const [rooms, setRooms] = useState<Room[]>(MOCK_ROOMS)

  const selected = rooms.find(r => r.id === selectedId) ?? rooms[0]

  const [editorNum,      setEditorNum]      = useState(selected.number)
  const [editorFloor,    setEditorFloor]    = useState(selected.floor)
  const [editorType,     setEditorType]     = useState<RoomType>(selected.type)
  const [editorGender,   setEditorGender]   = useState<GenderType>(selected.gender)
  const [editorPriority, setEditorPriority] = useState(selected.priority)
  const [editorBeds,     setEditorBeds]     = useState<BedEntry[]>(selected.beds)

  const loadRoom = (room: Room) => {
    setSelectedId(room.id)
    setEditorNum(room.number)
    setEditorFloor(room.floor)
    setEditorType(room.type)
    setEditorGender(room.gender)
    setEditorPriority(room.priority)
    setEditorBeds([...room.beds])
  }

  const addBed = () => {
    const nextId = editorBeds.length > 0 ? Math.max(...editorBeds.map(b => b.id)) + 1 : 1
    setEditorBeds(prev => [...prev, { id: nextId, name: `Койко-место #${nextId}`, status: 'Свободно' }])
  }

  const removeBed = (id: number) => setEditorBeds(prev => prev.filter(b => b.id !== id))

  const saveRoom = () => {
    setRooms(prev => prev.map(r => r.id === selectedId
      ? { ...r, number: editorNum, floor: editorFloor, type: editorType, gender: editorGender, priority: editorPriority, beds: editorBeds }
      : r
    ))
    alert('Изменения сохранены')
  }

  const resetEditor = () => {
    const room = rooms.find(r => r.id === selectedId)!
    loadRoom(room)
  }

  const deleteRoom = (id: string) => {
    if (!confirm('Удалить палату?')) return
    setRooms(prev => prev.filter(r => r.id !== id))
    if (id === selectedId && rooms.length > 1) {
      const next = rooms.find(r => r.id !== id)!
      loadRoom(next)
    }
  }

  // ── Filtered + paginated ─────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    return rooms.filter(r => {
      if (floorFilter !== 'all' && r.floor !== parseInt(floorFilter)) return false
      if (typeFilter  !== 'all' && r.type  !== typeFilter)            return false
      if (search && !r.number.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
  }, [rooms, floorFilter, typeFilter, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paged      = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const totalBeds  = rooms.reduce((s, r) => s + r.beds.length, 0)

  return (
    <PageWrapper>

      {/* ── Top row ── */}
      <PageTopRow>
        <PageTitleBlock>
          <PageTitle>Администрирование палат</PageTitle>
          <PageSubtitle>Управление структурой отделений, коечным фондом и параметрами доступа.</PageSubtitle>
        </PageTitleBlock>

        <StatsBadgesRow>
          <StatBadge>
            <StatBadgeLabel>Всего палат</StatBadgeLabel>
            <StatBadgeValue>{rooms.length}</StatBadgeValue>
          </StatBadge>
          <StatBadge>
            <StatBadgeLabel>Всего коек</StatBadgeLabel>
            <StatBadgeValue>{totalBeds}</StatBadgeValue>
          </StatBadge>
        </StatsBadgesRow>
      </PageTopRow>

      <TwoColLayout>
        {/* ── Left side ── */}
        <div>

          {/* Filter bar */}
          <FilterBar>
            <FilterIcon>
              <SlidersHorizontal size={14} />
              Фильтры:
            </FilterIcon>

            <FilterSelect value={floorFilter} onChange={e => { setFloorFilter(e.target.value); setPage(1) }}>
              <option value="all">Все этажи</option>
              {FLOORS.map(f => <option key={f} value={f}>{f} этаж</option>)}
            </FilterSelect>

            <FilterSelect value={typeFilter} onChange={e => { setTypeFilter(e.target.value); setPage(1) }}>
              <option value="all">Все типы</option>
              {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </FilterSelect>

            <SearchInput
              placeholder="Поиск по номеру..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1) }}
            />

            <ResetBtn onClick={() => { setFloorFilter('all'); setTypeFilter('all'); setSearch(''); setPage(1) }}>
              Сбросить
            </ResetBtn>
          </FilterBar>

          {/* Table */}
          <TableWrap>
            <Table>
              <Thead>
                <tr>
                  <Th>Этаж</Th>
                  <Th>Номер</Th>
                  <Th>Тип</Th>
                  <Th>Пол</Th>
                  <Th>Койки</Th>
                  <Th>Приор.</Th>
                  <Th>Действия</Th>
                </tr>
              </Thead>

              <Tbody>
                {paged.map(room => (
                  <Tr
                    key={room.id}
                    $selected={room.id === selectedId}
                    onClick={() => loadRoom(room)}
                  >
                    <TdMuted>{room.floor}</TdMuted>

                    <TdBold>{room.number}</TdBold>

                    <Td>
                      <TypeBadge $type={room.type}>{room.type}</TypeBadge>
                    </Td>

                    <Td>
                      <GenderCell>
                        {getGenderIcon(room.gender)}
                        {room.gender === 'Смешанная (Mixed)' ? 'Смешанная' : room.gender}
                      </GenderCell>
                    </Td>

                    <Td>
                      <BedCountCell>
                        <BedCountNum>{room.beds.length}</BedCountNum>
                        <BedCountUnit>ед.</BedCountUnit>
                      </BedCountCell>
                    </Td>

                    <Td>
                      <PriorityWrap>
                        {[1,2,3,4,5].map(i => (
                          <PriorityBar key={i} $filled={i <= room.priority} />
                        ))}
                      </PriorityWrap>
                    </Td>

                    <Td onClick={e => e.stopPropagation()}>
                      <ActionCell>
                        <ActionIconBtn title="Редактировать" onClick={() => loadRoom(room)}>
                          <Pencil size={13} />
                        </ActionIconBtn>
                        <ActionIconBtn $danger title="Удалить" onClick={() => deleteRoom(room.id)}>
                          <Trash2 size={13} />
                        </ActionIconBtn>
                      </ActionCell>
                    </Td>
                  </Tr>
                ))}

                {paged.length === 0 && (
                  <tr>
                    <Td colSpan={7} style={{ textAlign:'center', padding:'32px 16px', color:'#94a3b8', fontSize:13 }}>
                      Палаты не найдены
                    </Td>
                  </tr>
                )}
              </Tbody>
            </Table>

            {/* Pagination */}
            <PaginationRow>
              <PaginationInfo>
                Показано {Math.min((page-1)*PAGE_SIZE+1, filtered.length)}–{Math.min(page*PAGE_SIZE, filtered.length)} из {filtered.length} палат
              </PaginationInfo>

              <PaginationBtns>
                <PageBtn disabled={page === 1} onClick={() => setPage(p => p-1)}>
                  <ChevronLeft size={13} />
                </PageBtn>

                {Array.from({ length: totalPages }, (_, i) => i+1).map(p => (
                  <PageBtn key={p} $active={p === page} onClick={() => setPage(p)}>
                    {p}
                  </PageBtn>
                ))}

                <PageBtn disabled={page === totalPages} onClick={() => setPage(p => p+1)}>
                  <ChevronRight size={13} />
                </PageBtn>
              </PaginationBtns>
            </PaginationRow>
          </TableWrap>

        </div>

        {/* ── Right side — editor ── */}
        <EditorPanel>
          <EditorTitle>Редактор палаты</EditorTitle>
          <EditorSubtitle>Заполните параметры помещения и конфигурацию коек</EditorSubtitle>

          {/* Number + Floor */}
          <FormRow>
            <FormGroup>
              <FormLabel>Номер палаты</FormLabel>
              <FormInput
                value={editorNum}
                onChange={e => setEditorNum(e.target.value)}
                placeholder="305"
              />
            </FormGroup>

            <FormGroup>
              <FormLabel>Этаж</FormLabel>
              <FormSelect value={editorFloor} onChange={e => setEditorFloor(parseInt(e.target.value))}>
                {FLOORS.map(f => <option key={f} value={f}>{f} этаж</option>)}
              </FormSelect>
            </FormGroup>
          </FormRow>

          <Divider />

          {/* Room type */}
          <FormGroup style={{ marginBottom: 16 }}>
            <FormLabel>Тип палаты</FormLabel>
            <RadioGroup>
              {(['Обычная', 'Реанимация', 'Изолятор'] as RoomType[]).map(t => (
                <RadioLabel key={t}>
                  <input
                    type="radio"
                    name="room-type"
                    value={t}
                    checked={editorType === t}
                    onChange={() => setEditorType(t)}
                  />
                  {t}
                </RadioLabel>
              ))}
            </RadioGroup>
          </FormGroup>

          <Divider />

          {/* Gender profile */}
          <FormGroup style={{ marginBottom: 16 }}>
            <FormLabel>Профиль по полу</FormLabel>
            <FormSelect
              value={editorGender}
              onChange={e => setEditorGender(e.target.value as GenderType)}
            >
              <option>Мужская</option>
              <option>Женская</option>
              <option>Смешанная (Mixed)</option>
            </FormSelect>
          </FormGroup>

          <Divider />

          {/* Priority */}
          <SliderRow>
            <SliderLabel>
              Приоритет обслуживания
              <PriorityBadge>{editorPriority}</PriorityBadge>
            </SliderLabel>
            <PriorityLevelLabel>{PRIORITY_LABELS[editorPriority]}</PriorityLevelLabel>
          </SliderRow>
          <RangeInput
            type="range"
            min={1} max={5} step={1}
            value={editorPriority}
            onChange={e => setEditorPriority(parseInt(e.target.value))}
          />

          <Divider />

          {/* Beds */}
          <BedsMgmtHeader>
            <BedsMgmtTitle>Управление койками</BedsMgmtTitle>
            <AddBedBtn onClick={addBed}>
              <Plus size={13} />
              Добавить
            </AddBedBtn>
          </BedsMgmtHeader>

          <BedsList>
            {editorBeds.map(bed => (
              <BedItem key={bed.id}>
                <BedTag>К{bed.id}</BedTag>
                <BedInfo>
                  <BedName>{bed.name}</BedName>
                  <BedId>ID: {bed.id}</BedId>
                </BedInfo>
                <BedStatus>{bed.status}</BedStatus>
                <BedDeleteBtn onClick={() => removeBed(bed.id)}>
                  <Trash2 size={12} />
                </BedDeleteBtn>
              </BedItem>
            ))}
          </BedsList>

          {/* Footer */}
          <EditorFooter>
            <SaveBtn onClick={saveRoom}>
              <Save size={15} />
              Сохранить изменения
            </SaveBtn>
            <ResetEditorBtn onClick={resetEditor} title="Сбросить">
              <RotateCcw size={15} />
            </ResetEditorBtn>
          </EditorFooter>
        </EditorPanel>

      </TwoColLayout>
    </PageWrapper>
  )
}

export default WardAdmin