import React, { useMemo, useState, useEffect } from 'react'
import {
  RotateCcw,
  Trash2,
  Plus,
  Save,
  UserPlus,
  UserCog,
  User,
  Search,
  ChevronLeft,
  ChevronRight,
  X,
  Check,
  AlertCircle
} from 'lucide-react'
import { toast } from 'react-toastify'
import { showApiError } from 'utils/showApiError'

import {
  fetchStaffMembers,
  createStaffMember,
  updateStaffMember,
  deleteStaffMember,
  StaffMemberDto
} from 'api/staffAdminApi'

import {
  PageWrapper,
  StyledCard,
  CardHeader,
  CardContent,
  HeaderRow,
  TitleSection,
  PageTitle,
  CardSubtitle,
  TwoColLayout,
  FilterBar,
  FilterIcon,
  FilterSelect,
  SearchInput,
  ResetBtn,
  AddStaffBtn,
  TableWrap,
  TableContainer,
  Table,
  Thead,
  Th,
  Tbody,
  Tr,
  Td,
  TdBold,
  TdMuted,
  RoleBadge,
  ActionCell,
  ActionIconBtn,
  EditorPanel,
  EditorTitle,
  EditorSubtitle,
  Divider,
  FormRow,
  FormGroup,
  FormLabel,
  FormInput,
  PasswordInput,
  FormSelect,
  EditorFooter,
  SaveBtn,
  ResetEditorBtn,
  PasswordHint,
  PaginationRow,
  PaginationInfo,
  PaginationBtns,
  PageBtn
} from './styled'

const ROLE_LABELS: Record<string, string> = {
  ChiefDoctor: 'Главный врач',
  Doctor: 'Врач',
  HeadNurse: 'Старшая медсестра',
  Nurse: 'Медицинская сестра',
  LaboratoryEmployee: 'Лаборант'
}

const PAGE_SIZE = 10

export default function StaffAdminPage() {
  const [staff, setStaff] = useState<StaffMemberDto[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('All')

  
  const [currentPage, setCurrentPage] = useState(1)

  
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const [formName, setFormName] = useState('')
  const [formPosition, setFormPosition] = useState('')
  const [formLogin, setFormLogin] = useState('')
  const [formPassword, setFormPassword] = useState('')
  const [formRole, setFormRole] = useState('Doctor')

  const loadStaff = async () => {
    setLoading(true)
    try {
      const data = await fetchStaffMembers()
      setStaff(data)
    } catch (err) {
      showApiError(err, 'Не удалось загрузить список сотрудников')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadStaff()
  }, [])

  
  const filteredStaff = useMemo(() => {
    let list = [...staff]

    if (roleFilter !== 'All') {
      list = list.filter((s) => s.role === roleFilter)
    }

    const q = searchQuery.trim().toLowerCase()
    if (q) {
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.position.toLowerCase().includes(q) ||
          s.login?.toLowerCase().includes(q)
      )
    }

    return list
  }, [staff, roleFilter, searchQuery])

  
  const paginatedStaff = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    return filteredStaff.slice(start, start + PAGE_SIZE)
  }, [filteredStaff, currentPage])

  const totalPages = Math.ceil(filteredStaff.length / PAGE_SIZE)

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, roleFilter])

  
  const handleSelectStaff = (member: StaffMemberDto) => {
    setSelectedStaffId(member.id)
    setIsEditing(true)
    setFormName(member.name)
    setFormPosition(member.position)
    setFormLogin(member.login || '')
    setFormPassword('')
    setFormRole(member.role || 'Doctor')
  }

  
  const handleAddNew = () => {
    setSelectedStaffId(null)
    setIsEditing(true)
    setFormName('')
    setFormPosition('')
    setFormLogin('')
    setFormPassword('')
    setFormRole('Doctor')
  }

  
  const handleCancelEdit = () => {
    setSelectedStaffId(null)
    setIsEditing(false)
    setFormName('')
    setFormPosition('')
    setFormLogin('')
    setFormPassword('')
    setFormRole('Doctor')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formName.trim()) {
      toast.error('ФИО сотрудника обязательно для заполнения')
      return
    }
    if (!formPosition.trim()) {
      toast.error('Должность обязательна для заполнения')
      return
    }
    if (!formLogin.trim()) {
      toast.error('Логин обязателен для заполнения')
      return
    }
    if (!selectedStaffId && !formPassword) {
      toast.error('Пароль обязателен для создания нового сотрудника')
      return
    }

    if (!selectedStaffId || formPassword) {
      if (formPassword.length < 8) {
        toast.error('Пароль должен содержать не менее 8 символов')
        return
      }
      if (!/[A-Z]/.test(formPassword)) {
        toast.error('Пароль должен содержать хотя бы одну заглавную букву')
        return
      }
      if (!/[0-9]/.test(formPassword)) {
        toast.error('Пароль должен содержать хотя бы одну цифру')
        return
      }
    }

    setSubmitting(true)
    try {
      if (selectedStaffId) {
        
        await updateStaffMember(selectedStaffId, {
          name: formName.trim(),
          position: formPosition.trim(),
          login: formLogin.trim(),
          password: formPassword || undefined,
          role: formRole
        })
        toast.success('Информация о сотруднике успешно обновлена')
      } else {
        
        await createStaffMember({
          name: formName.trim(),
          position: formPosition.trim(),
          login: formLogin.trim(),
          password: formPassword,
          role: formRole
        })
        toast.success('Новый сотрудник успешно добавлен')
      }
      handleCancelEdit()
      await loadStaff()
    } catch (err) {
      showApiError(err, 'Не удалось сохранить сотрудника')
    } finally {
      setSubmitting(false)
    }
  }

  
  const handleDelete = async (member: StaffMemberDto, e: React.MouseEvent) => {
    e.stopPropagation() 

    const confirmMsg = `Вы действительно хотите удалить сотрудника ${member.name}? Это также удалит его учетную запись в системе.`
    if (!window.confirm(confirmMsg)) {
      return
    }

    try {
      await deleteStaffMember(member.id)
      toast.success('Сотрудник успешно удален')
      if (selectedStaffId === member.id) {
        handleCancelEdit()
      }
      await loadStaff()
    } catch (err) {
      showApiError(err, 'Не удалось удалить сотрудника')
    }
  }

  const handleResetFilters = () => {
    setSearchQuery('')
    setRoleFilter('All')
  }

  return (
    <PageWrapper>
      <StyledCard>
        <CardHeader>
          <HeaderRow>
            <TitleSection>
              <PageTitle>Управление персоналом</PageTitle>
              <CardSubtitle>
                Добавление, редактирование информации и управление доступом сотрудников отделения
              </CardSubtitle>
            </TitleSection>
            {!isEditing && (
              <AddStaffBtn onClick={handleAddNew}>
                <Plus size={16} />
                Добавить сотрудника
              </AddStaffBtn>
            )}
          </HeaderRow>
        </CardHeader>
      </StyledCard>

      <TwoColLayout>
        <div>
          <FilterBar>
            <FilterIcon>
              <User size={16} />
              Фильтр:
            </FilterIcon>
            <SearchInput
              type="text"
              placeholder="Поиск по ФИО, должности или логину..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <FilterSelect value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
              <option value="All">Все роли</option>
              <option value="ChiefDoctor">Главный врач</option>
              <option value="Doctor">Врач</option>
              <option value="HeadNurse">Старшая медсестра</option>
              <option value="Nurse">Медицинская сестра</option>
              <option value="LaboratoryEmployee">Лаборант</option>
            </FilterSelect>
            <ResetBtn onClick={handleResetFilters} title="Сбросить фильтры">
              <RotateCcw size={16} />
            </ResetBtn>
          </FilterBar>

          <TableWrap>
            <TableContainer>
              <Table>
                <Thead>
                  <tr>
                    <Th>Сотрудник</Th>
                    <Th>Должность</Th>
                    <Th>Логин</Th>
                    <Th>Системная роль</Th>
                    <Th style={{ width: '80px', textAlign: 'center' }}></Th>
                  </tr>
                </Thead>
                <Tbody>
                  {loading ? (
                    <Tr>
                      <Td colSpan={5} style={{ textAlign: 'center', padding: '32px 0' }}>
                        Загрузка сотрудников...
                      </Td>
                    </Tr>
                  ) : paginatedStaff.length === 0 ? (
                    <Tr>
                      <Td colSpan={5} style={{ textAlign: 'center', padding: '32px 0' }}>
                        Ничего не найдено
                      </Td>
                    </Tr>
                  ) : (
                    paginatedStaff.map((member) => (
                      <Tr
                        key={member.id}
                        $selected={selectedStaffId === member.id}
                        onClick={() => handleSelectStaff(member)}
                      >
                        <TdBold>{member.name}</TdBold>
                        <Td>{member.position}</Td>
                        <TdMuted>{member.login || '—'}</TdMuted>
                        <Td>
                          {member.role ? (
                            <RoleBadge $role={member.role}>
                              {ROLE_LABELS[member.role] || member.role}
                            </RoleBadge>
                          ) : (
                            <TdMuted>—</TdMuted>
                          )}
                        </Td>
                        <Td style={{ textAlign: 'center' }}>
                          <ActionCell>
                            <ActionIconBtn
                              $danger
                              onClick={(e) => handleDelete(member, e)}
                              title="Удалить сотрудника"
                            >
                              <Trash2 size={14} />
                            </ActionIconBtn>
                          </ActionCell>
                        </Td>
                      </Tr>
                    ))
                  )}
                </Tbody>
              </Table>
            </TableContainer>

            {totalPages > 1 && (
              <PaginationRow>
                <PaginationInfo>
                  Показано {(currentPage - 1) * PAGE_SIZE + 1} -{' '}
                  {Math.min(currentPage * PAGE_SIZE, filteredStaff.length)} из {filteredStaff.length}
                </PaginationInfo>
                <PaginationBtns>
                  <PageBtn
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft size={16} />
                  </PageBtn>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <PageBtn
                      key={p}
                      $active={currentPage === p}
                      onClick={() => setCurrentPage(p)}
                    >
                      {p}
                    </PageBtn>
                  ))}
                  <PageBtn
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight size={16} />
                  </PageBtn>
                </PaginationBtns>
              </PaginationRow>
            )}
          </TableWrap>
        </div>

        <div>
          {isEditing ? (
            <EditorPanel>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <EditorTitle>
                  {selectedStaffId ? 'Редактирование' : 'Новый сотрудник'}
                </EditorTitle>
                <ActionIconBtn onClick={handleCancelEdit} title="Закрыть редактор">
                  <X size={16} />
                </ActionIconBtn>
              </div>
              <EditorSubtitle>
                {selectedStaffId
                  ? 'Измените поля ниже и сохраните данные'
                  : 'Заполните обязательные поля для регистрации в системе'}
              </EditorSubtitle>
              <Divider />

              <form onSubmit={handleSubmit}>
                <FormRow>
                  <FormGroup>
                    <FormLabel>ФИО сотрудника</FormLabel>
                    <FormInput
                      type="text"
                      required
                      placeholder="Иванов Иван Иванович"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                    />
                  </FormGroup>

                  <FormGroup>
                    <FormLabel>Должность</FormLabel>
                    <FormInput
                      type="text"
                      required
                      placeholder="Врач-пульмонолог"
                      value={formPosition}
                      onChange={(e) => setFormPosition(e.target.value)}
                    />
                  </FormGroup>

                  <FormGroup>
                    <FormLabel>Логин для входа</FormLabel>
                    <FormInput
                      type="text"
                      required
                      placeholder="ivanov_ii"
                      value={formLogin}
                      onChange={(e) => setFormLogin(e.target.value)}
                    />
                  </FormGroup>

                  <FormGroup>
                    <FormLabel>Пароль</FormLabel>
                    <PasswordInput
                      type="password"
                      placeholder={selectedStaffId ? '••••••••' : 'Введите пароль'}
                      required={!selectedStaffId}
                      value={formPassword}
                      onChange={(e) => setFormPassword(e.target.value)}
                    />
                    <PasswordHint>
                      {selectedStaffId
                        ? 'Оставьте пустым, чтобы не изменять. Иначе: не менее 8 символов, заглавная буква и цифра'
                        : 'Требования: не менее 8 символов, заглавная буква и цифра'}
                    </PasswordHint>
                  </FormGroup>

                  <FormGroup>
                    <FormLabel>Системная роль</FormLabel>
                    <FormSelect
                      value={formRole}
                      onChange={(e) => setFormRole(e.target.value)}
                    >
                      <option value="Doctor">Врач (Doctor)</option>
                      <option value="Nurse">Медицинская сестра (Nurse)</option>
                      <option value="HeadNurse">Старшая медсестра (HeadNurse)</option>
                      <option value="ChiefDoctor">Главный врач (ChiefDoctor)</option>
                      <option value="LaboratoryEmployee">Лаборант (LaboratoryEmployee)</option>
                    </FormSelect>
                  </FormGroup>
                </FormRow>

                <EditorFooter>
                  <ResetEditorBtn type="button" onClick={handleCancelEdit}>
                    Отмена
                  </ResetEditorBtn>
                  <SaveBtn type="submit" disabled={submitting}>
                    <Save size={16} />
                    {selectedStaffId ? 'Сохранить' : 'Создать'}
                  </SaveBtn>
                </EditorFooter>
              </form>
            </EditorPanel>
          ) : (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '40px 20px',
                background: '#ffffff',
                border: '1px dashed rgba(191, 219, 254, 0.8)',
                borderRadius: '16px',
                textAlign: 'center',
                color: '#94a3b8'
              }}
            >
              <UserCog size={48} style={{ marginBottom: '16px', color: '#cbd5e1' }} />
              <h3 style={{ margin: '0 0 8px 0', color: '#64748b' }}>Редактор сотрудника</h3>
              <p style={{ margin: 0, fontSize: '13px', maxWidth: '240px' }}>
                Выберите сотрудника из списка для редактирования или нажмите «Добавить сотрудника»
              </p>
            </div>
          )}
        </div>
      </TwoColLayout>
    </PageWrapper>
  )
}
