import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...\n')

  // Limpar dados existentes
  console.log('🗑️  Limpando dados existentes...')
  await prisma.scheduling.deleteMany()
  await prisma.equipment.deleteMany()
  await prisma.user.deleteMany()
  console.log('✅ Dados limpos!\n')

  // ============================================
  // 1. CRIAR USUÁRIOS
  // ============================================
  console.log('👥 Criando usuários...')
  
  const password = 'senha123'
  const hashedPassword = await bcrypt.hash(password, 8)

  const admin = await prisma.user.create({
    data: {
      fullName: 'Carlos Silva',
      email: 'admin@escola.com',
      phone: '11987654321',
      role: 'ADMIN',
      password: hashedPassword,
      isActive: true,
    },
  })
  console.log('  ✅ ADMIN criado: admin@escola.com')

  const staff = await prisma.user.create({
    data: {
      fullName: 'Maria Santos',
      email: 'staff@escola.com',
      phone: '11987654322',
      role: 'STAFF',
      password: hashedPassword,
      isActive: true,
    },
  })
  console.log('  ✅ STAFF criado: staff@escola.com')

  const teacher1 = await prisma.user.create({
    data: {
      fullName: 'Prof. João Oliveira',
      email: 'professor@escola.com',
      phone: '11987654323',
      role: 'TEACHER',
      password: hashedPassword,
      isActive: true,
    },
  })
  console.log('  ✅ TEACHER criado: professor@escola.com')

  const teacher2 = await prisma.user.create({
    data: {
      fullName: 'Profa. Ana Paula Costa',
      email: 'ana.costa@escola.com',
      phone: '11987654324',
      role: 'TEACHER',
      password: hashedPassword,
      isActive: true,
    },
  })
  console.log('  ✅ TEACHER criado: ana.costa@escola.com')

  const teacher3 = await prisma.user.create({
    data: {
      fullName: 'Prof. Pedro Henrique Alves',
      email: 'pedro.alves@escola.com',
      phone: '11987654325',
      role: 'TEACHER',
      password: hashedPassword,
      isActive: true,
    },
  })
  console.log('  ✅ TEACHER criado: pedro.alves@escola.com\n')

  // ============================================
  // 2. CRIAR EQUIPAMENTOS
  // ============================================
  console.log('💻 Criando equipamentos...')

  const notebooks = await prisma.equipment.create({
    data: {
      name: 'Notebook Dell Inspiron',
      description: 'Notebook para desenvolvimento e apresentações - Intel i5, 8GB RAM, SSD 256GB',
      type: 'NOTEBOOK',
      quantity: 5,
      status: 'AVAILABLE',
      isActive: true,
    },
  })
  console.log('  ✅ Notebooks criados (5 unidades)')

  const tablets = await prisma.equipment.create({
    data: {
      name: 'Tablet Samsung Galaxy Tab',
      description: 'Tablets para aulas interativas e pesquisas - 10.1", 64GB',
      type: 'TABLET',
      quantity: 8,
      status: 'AVAILABLE',
      isActive: true,
    },
  })
  console.log('  ✅ Tablets criados (8 unidades)')

  const projectors = await prisma.equipment.create({
    data: {
      name: 'Projetor Epson PowerLite',
      description: 'Projetor Full HD para apresentações - 3000 lumens, HDMI',
      type: 'PROJECTOR',
      quantity: 3,
      status: 'AVAILABLE',
      isActive: true,
    },
  })
  console.log('  ✅ Projetores criados (3 unidades)')

  const cameras = await prisma.equipment.create({
    data: {
      name: 'Câmera Canon EOS Rebel',
      description: 'Câmera DSLR para projetos audiovisuais - 24MP, Kit com lente',
      type: 'CAMERA',
      quantity: 2,
      status: 'AVAILABLE',
      isActive: true,
    },
  })
  console.log('  ✅ Câmeras criadas (2 unidades)')

  const microphones = await prisma.equipment.create({
    data: {
      name: 'Microfone Shure SM58',
      description: 'Microfone profissional para eventos e gravações',
      type: 'MICROPHONE',
      quantity: 4,
      status: 'AVAILABLE',
      isActive: true,
    },
  })
  console.log('  ✅ Microfones criados (4 unidades)')

  const soundBoxes = await prisma.equipment.create({
    data: {
      name: 'Caixa de Som JBL Partybox',
      description: 'Caixa de som portátil para eventos - 300W, Bluetooth',
      type: 'SOUND_BOX',
      quantity: 2,
      status: 'AVAILABLE',
      isActive: true,
    },
  })
  console.log('  ✅ Caixas de som criadas (2 unidades)')

  const cablesAdapters = await prisma.equipment.create({
    data: {
      name: 'Kit Cabos e Adaptadores',
      description: 'Kit completo: HDMI, VGA, USB-C, adaptadores diversos',
      type: 'CABLES_ADAPTERS',
      quantity: 10,
      status: 'AVAILABLE',
      isActive: true,
    },
  })
  console.log('  ✅ Kits de cabos criados (10 unidades)')

  const inactiveLaptop = await prisma.equipment.create({
    data: {
      name: 'Notebook HP (Em Manutenção)',
      description: 'Notebook aguardando reparo técnico',
      type: 'NOTEBOOK',
      quantity: 2,
      status: 'MAINTENANCE',
      isActive: true,
    },
  })
  console.log('  ✅ Equipamento em manutenção criado\n')

  // ============================================
  // 3. CRIAR AGENDAMENTOS
  // ============================================
  console.log('📅 Criando agendamentos...')

  const now = new Date()
  
  // Função helper para criar datas
  const addDays = (date: Date, days: number) => {
    const result = new Date(date)
    result.setDate(result.getDate() + days)
    return result
  }

  const setTime = (date: Date, hours: number, minutes: number = 0) => {
    const result = new Date(date)
    result.setHours(hours, minutes, 0, 0)
    return result
  }

  // ============================================
  // AGENDAMENTOS PASSADOS (COMPLETED)
  // ============================================
  
  // 1. Agendamento passado - Notebooks (COMPLETED)
  await prisma.scheduling.create({
    data: {
      equipmentId: notebooks.id,
      userId: teacher1.id,
      startDate: setTime(addDays(now, -10), 14),
      endDate: setTime(addDays(now, -10), 17),
      quantity: 3,
      notes: 'Aula prática de programação - Turma 3A',
      status: 'COMPLETED',
    },
  })
  console.log('  ✅ Agendamento COMPLETED: Notebooks há 10 dias')

  // 2. Agendamento passado - Tablets (COMPLETED)
  await prisma.scheduling.create({
    data: {
      equipmentId: tablets.id,
      userId: teacher2.id,
      startDate: setTime(addDays(now, -7), 9),
      endDate: setTime(addDays(now, -7), 12),
      quantity: 5,
      notes: 'Pesquisa em sala sobre biodiversidade',
      status: 'COMPLETED',
    },
  })
  console.log('  ✅ Agendamento COMPLETED: Tablets há 7 dias')

  // 3. Agendamento passado - Projetor (COMPLETED)
  await prisma.scheduling.create({
    data: {
      equipmentId: projectors.id,
      userId: teacher1.id,
      startDate: setTime(addDays(now, -5), 10),
      endDate: setTime(addDays(now, -5), 11, 30),
      quantity: 1,
      notes: 'Apresentação TCC - Turma Formandos',
      status: 'COMPLETED',
    },
  })
  console.log('  ✅ Agendamento COMPLETED: Projetor há 5 dias')

  // ============================================
  // AGENDAMENTOS PASSADOS (CANCELLED)
  // ============================================
  
  // 4. Agendamento cancelado
  await prisma.scheduling.create({
    data: {
      equipmentId: cameras.id,
      userId: teacher3.id,
      startDate: setTime(addDays(now, -3), 14),
      endDate: setTime(addDays(now, -3), 18),
      quantity: 1,
      notes: 'Gravação documentário (CANCELADO - Adiado)',
      status: 'CANCELLED',
    },
  })
  console.log('  ✅ Agendamento CANCELLED há 3 dias')

  // ============================================
  // AGENDAMENTOS FUTUROS (SCHEDULED)
  // ============================================
  
  // 5. Agendamento futuro - Notebooks (SCHEDULED)
  await prisma.scheduling.create({
    data: {
      equipmentId: notebooks.id,
      userId: teacher2.id,
      startDate: setTime(addDays(now, 2), 8),
      endDate: setTime(addDays(now, 2), 12),
      quantity: 4,
      notes: 'Workshop de Design Gráfico',
      status: 'SCHEDULED',
    },
  })
  console.log('  ✅ Agendamento SCHEDULED: Notebooks daqui a 2 dias')

  // 6. Agendamento futuro - Tablets (SCHEDULED)
  await prisma.scheduling.create({
    data: {
      equipmentId: tablets.id,
      userId: teacher1.id,
      startDate: setTime(addDays(now, 3), 13),
      endDate: setTime(addDays(now, 3), 16),
      quantity: 6,
      notes: 'Atividade interativa de matemática - Turma 2B',
      status: 'SCHEDULED',
    },
  })
  console.log('  ✅ Agendamento SCHEDULED: Tablets daqui a 3 dias')

  // 7. Agendamento futuro - Projetor (SCHEDULED)
  await prisma.scheduling.create({
    data: {
      equipmentId: projectors.id,
      userId: teacher3.id,
      startDate: setTime(addDays(now, 5), 14),
      endDate: setTime(addDays(now, 5), 16),
      quantity: 1,
      notes: 'Apresentação de projeto interdisciplinar',
      status: 'SCHEDULED',
    },
  })
  console.log('  ✅ Agendamento SCHEDULED: Projetor daqui a 5 dias')

  // ============================================
  // AGENDAMENTOS FUTUROS (CONFIRMED)
  // ============================================
  
  // 8. Agendamento confirmado - Câmera (CONFIRMED)
  await prisma.scheduling.create({
    data: {
      equipmentId: cameras.id,
      userId: teacher2.id,
      startDate: setTime(addDays(now, 7), 9),
      endDate: setTime(addDays(now, 7), 17),
      quantity: 2,
      notes: 'Produção de vídeo institucional da escola',
      status: 'CONFIRMED',
    },
  })
  console.log('  ✅ Agendamento CONFIRMED: Câmeras daqui a 7 dias')

  // 9. Agendamento confirmado - Microfones e Caixa de Som (CONFIRMED)
  await prisma.scheduling.create({
    data: {
      equipmentId: microphones.id,
      userId: staff.id,
      startDate: setTime(addDays(now, 10), 8),
      endDate: setTime(addDays(now, 10), 18),
      quantity: 3,
      notes: 'Festa Junina da Escola',
      status: 'CONFIRMED',
    },
  })
  console.log('  ✅ Agendamento CONFIRMED: Microfones daqui a 10 dias')

  await prisma.scheduling.create({
    data: {
      equipmentId: soundBoxes.id,
      userId: staff.id,
      startDate: setTime(addDays(now, 10), 8),
      endDate: setTime(addDays(now, 10), 18),
      quantity: 2,
      notes: 'Festa Junina da Escola',
      status: 'CONFIRMED',
    },
  })
  console.log('  ✅ Agendamento CONFIRMED: Caixas de som daqui a 10 dias')

  // 10. Agendamento futuro próximo - Cabos (CONFIRMED)
  await prisma.scheduling.create({
    data: {
      equipmentId: cablesAdapters.id,
      userId: teacher1.id,
      startDate: setTime(addDays(now, 1), 13),
      endDate: setTime(addDays(now, 1), 15),
      quantity: 5,
      notes: 'Laboratório de informática - Conexões diversas',
      status: 'CONFIRMED',
    },
  })
  console.log('  ✅ Agendamento CONFIRMED: Cabos amanhã')

  // 11. Agendamento daqui a 15 dias - Notebooks (SCHEDULED)
  await prisma.scheduling.create({
    data: {
      equipmentId: notebooks.id,
      userId: teacher2.id,
      startDate: setTime(addDays(now, 15), 10),
      endDate: setTime(addDays(now, 15), 16),
      quantity: 5,
      notes: 'Simulado ENEM Digital',
      status: 'SCHEDULED',
    },
  })
  console.log('  ✅ Agendamento SCHEDULED: Notebooks daqui a 15 dias')

  // 12. Agendamento daqui a 20 dias - Projetores (SCHEDULED)
  await prisma.scheduling.create({
    data: {
      equipmentId: projectors.id,
      userId: admin.id,
      startDate: setTime(addDays(now, 20), 19),
      endDate: setTime(addDays(now, 20), 22),
      quantity: 2,
      notes: 'Reunião de Pais e Mestres',
      status: 'SCHEDULED',
    },
  })
  console.log('  ✅ Agendamento SCHEDULED: Projetores daqui a 20 dias\n')

  // ============================================
  // RESUMO FINAL
  // ============================================
  console.log('🎉 Seed concluído com sucesso!\n')
  console.log('=' .repeat(50))
  console.log('📊 RESUMO DO SEED')
  console.log('=' .repeat(50))
  console.log('\n👥 USUÁRIOS CRIADOS (5):')
  console.log('  📧 admin@escola.com       - Role: ADMIN')
  console.log('  📧 staff@escola.com       - Role: STAFF')
  console.log('  📧 professor@escola.com   - Role: TEACHER')
  console.log('  📧 ana.costa@escola.com   - Role: TEACHER')
  console.log('  📧 pedro.alves@escola.com - Role: TEACHER')
  console.log('  🔑 Senha para todos: senha123')
  
  console.log('\n💻 EQUIPAMENTOS CRIADOS (8 tipos):')
  console.log('  ✅ 5x Notebook Dell Inspiron')
  console.log('  ✅ 8x Tablet Samsung Galaxy Tab')
  console.log('  ✅ 3x Projetor Epson PowerLite')
  console.log('  ✅ 2x Câmera Canon EOS Rebel')
  console.log('  ✅ 4x Microfone Shure SM58')
  console.log('  ✅ 2x Caixa de Som JBL Partybox')
  console.log('  ✅ 10x Kit Cabos e Adaptadores')
  console.log('  🔧 2x Notebook HP (Em Manutenção)')
  
  console.log('\n📅 AGENDAMENTOS CRIADOS (12):')
  console.log('  ✔️  3x COMPLETED (passados)')
  console.log('  ❌ 1x CANCELLED (passado)')
  console.log('  📋 5x SCHEDULED (futuros)')
  console.log('  ✅ 3x CONFIRMED (futuros)')
  
  console.log('\n🎯 DISTRIBUIÇÃO TEMPORAL:')
  console.log('  📅 Agendamentos passados: há 10, 7, 5 e 3 dias')
  console.log('  📅 Agendamentos futuros: +1, +2, +3, +5, +7, +10, +15, +20 dias')
  
  console.log('\n' + '='.repeat(50))
  console.log('✨ Sistema pronto para apresentação!')
  console.log('='.repeat(50) + '\n')
}

main()
  .catch((e) => {
    console.error('❌ Erro ao executar seed:', e)
    process.exit(1)
  })
  .finally(() => {
    prisma.$disconnect()
  })
