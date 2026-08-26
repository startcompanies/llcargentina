export type PostSection = {
  heading?: string;
  paragraphs?: string[];
  bullets?: string[];
  note?: string;
};

export type Post = {
  slug: string;
  title: string;
  seoTitle: string;
  description: string;
  category: 'Primeros pasos' | 'Operaciones' | 'Cumplimiento' | 'Ventas globales';
  date: string;
  updated: string;
  readTime: string;
  accent: 'lime' | 'coral' | 'gold' | 'sand';
  sections: PostSection[];
};

export const posts: Post[] = [
  {
    slug: 'llc-para-consultores-independientes',
    title: 'LLC para consultores: cuándo puede ordenar tu operación internacional',
    seoTitle: 'LLC para consultores independientes',
    description: 'Una guía práctica para consultores que cobran en dólares, trabajan con clientes del exterior y evalúan abrir una LLC en Estados Unidos.',
    category: 'Primeros pasos', date: '2026-08-18', updated: '2026-08-26', readTime: '5 min', accent: 'lime',
    sections: [
      { paragraphs: ['Cuando tus clientes están en distintos países, la fricción suele aparecer en el cobro, los contratos y la separación entre dinero personal y profesional. Una LLC puede darte una estructura común para esas tres cosas, aunque no es una solución universal.'] },
      { heading: 'Señales de que vale la pena evaluarla', bullets: ['Tus clientes piden contratos o facturas emitidas por una empresa.', 'Necesitás recibir pagos en dólares y pagar herramientas o proveedores internacionales.', 'Querés separar con claridad los movimientos del negocio de tus gastos personales.', 'Tu operación ya puede sostener los costos anuales de mantenimiento.'] },
      { heading: 'Lo que una LLC no resuelve sola', paragraphs: ['Constituir la entidad no reemplaza el análisis tributario en tu país de residencia ni garantiza la aprobación de una cuenta bancaria. También tendrás obligaciones informativas y fechas que cumplir en Estados Unidos.'], note: 'Antes de avanzar, compará el beneficio operativo con el costo total del primer año y de los años siguientes.' },
      { heading: 'Un orden razonable para empezar', paragraphs: ['Definí qué vas a vender, quién será titular, desde qué país se administrará el negocio y qué volumen estimás cobrar. Con esas respuestas se puede elegir el estado, preparar la documentación y anticipar el esquema de cumplimiento.'] },
      { heading: 'La estructura no reemplaza tu actividad profesional', paragraphs: ['Una LLC puede ordenar contratos, facturación y cobros, pero no elimina la responsabilidad personal por el servicio que prestás. Si tu actividad requiere matrícula, licencia o seguro profesional, verificá esas reglas en la jurisdicción aplicable antes de presentar la LLC como solución de protección total.'] },
      { heading: 'Checklist antes de constituir', bullets: ['Definí el servicio, el cliente ideal y la forma en que documentarás cada venta.', 'Proyectá el costo de alta, Registered Agent, reportes y preparación fiscal para dos o tres años.', 'Revisá con un asesor de tu país cómo se tratarán ingresos, distribuciones y tu residencia fiscal.', 'Prepará una presencia comercial coherente: dominio, correo, contratos y descripción de la actividad.'] },
      { heading: 'La decisión se mide por operaciones, no por promesas', paragraphs: ['Para un consultor que ya tiene clientes internacionales, una entidad puede aportar orden y trazabilidad. Para quien todavía está validando una oferta o tiene ingresos esporádicos, sumar obligaciones puede ser prematuro. La mejor decisión nace de comparar el flujo comercial que necesitás con el costo y el mantenimiento que asumirás.'] },
    ],
  },
  {
    slug: 'ein-llc-para-que-sirve',
    title: 'EIN de una LLC: qué habilita y por qué no es un número más',
    seoTitle: 'EIN para una LLC: usos y pasos clave',
    description: 'Qué es el EIN, para qué lo usa una LLC, cómo se relaciona con bancos y plataformas y en qué momentos del proceso de apertura suele ser necesario.',
    category: 'Primeros pasos', date: '2026-08-11', updated: '2026-08-26', readTime: '5 min', accent: 'coral',
    sections: [
      { paragraphs: ['El Employer Identification Number es el identificador federal que el IRS asigna a una empresa. Para una LLC de un titular extranjero suele ser una pieza central del expediente operativo.'] },
      { heading: 'Dónde aparece el EIN', bullets: ['Solicitud de cuentas bancarias empresariales.', 'Formularios fiscales e informativos federales.', 'Alta con procesadores de pago y plataformas comerciales.', 'Documentación de proveedores y clientes corporativos.'] },
      { heading: 'EIN no es lo mismo que ITIN', paragraphs: ['El EIN identifica a la entidad. El ITIN identifica a una persona que necesita un número tributario estadounidense y no reúne los requisitos para un SSN. Según el caso, podés necesitar uno, ambos o solamente el EIN.'] },
      { heading: 'Qué conviene archivar', paragraphs: ['Conservá la carta de asignación, los artículos de organización y el Operating Agreement en un repositorio seguro. Bancos y plataformas pueden volver a pedirlos durante revisiones de cumplimiento.'] },
      { heading: 'El EIN identifica a la entidad ante el IRS', paragraphs: ['No es una licencia comercial, una cuenta bancaria ni una autorización migratoria. Es un número de identificación tributaria federal de la empresa. Por eso, obtenerlo no responde por sí solo cómo tributará la LLC ni qué obligaciones tendrás en Estados Unidos o en tu país de residencia.'] },
      { heading: 'Datos que tienen que coincidir', bullets: ['Nombre legal de la LLC, tal como fue aceptado por el estado.', 'Dirección y datos del responsable que figuran en la solicitud.', 'Actividad comercial explicada de forma clara y consistente.', 'Titulares, administradores y documentos utilizados frente a banco o procesador.'] },
      { heading: 'Evitá usarlo como un dato “de trámite”', paragraphs: ['El EIN suele reaparecer en formularios, verificaciones y relaciones con terceros. Guardá la notificación de asignación y registrá quién tiene acceso a ella. Si cambian titularidad, dirección o clasificación, no asumas que basta con actualizar un perfil comercial: confirmá qué aviso o formulario corresponde.'] },
    ],
  },
  {
    slug: 'cuenta-bancaria-llc-no-residente',
    title: 'Cuenta bancaria para una LLC de no residente: cómo preparar la solicitud',
    seoTitle: 'Cuenta bancaria para una LLC extranjera',
    description: 'Documentos, coherencia comercial y buenas prácticas para presentar desde Latinoamérica una solicitud bancaria sólida con una LLC estadounidense.',
    category: 'Operaciones', date: '2026-08-04', updated: '2026-08-26', readTime: '6 min', accent: 'gold',
    sections: [
      { paragraphs: ['La aprobación bancaria depende de cada institución. La mejor estrategia no es buscar atajos, sino presentar un negocio entendible, documentos consistentes y una actividad que coincida con lo declarado.'] },
      { heading: 'El expediente básico', bullets: ['Artículos de organización aprobados por el estado.', 'Operating Agreement firmado.', 'Carta del EIN y documento de identidad vigente.', 'Sitio web, contratos o evidencia comercial cuando corresponda.', 'Direcciones y datos de contacto consistentes.'] },
      { heading: 'La descripción del negocio importa', paragraphs: ['Explicá en lenguaje simple qué vendés, a quién, en qué países y cómo recibís el dinero. Una descripción vaga o distinta entre el sitio, el formulario y los comprobantes suele generar preguntas adicionales.'] },
      { heading: 'Después de abrir la cuenta', paragraphs: ['Usala para movimientos de la empresa, guardá comprobantes y conciliá cada mes. Separar fondos es una práctica operativa básica y ayuda a sostener la trazabilidad del negocio.'], note: 'Ningún intermediario puede garantizar una aprobación: la decisión final siempre corresponde a la entidad financiera.' },
      { heading: 'Banco, fintech y procesador no evalúan lo mismo', paragraphs: ['Una cuenta empresarial y un procesador de pagos pueden revisar información parecida, pero sus políticas no son idénticas. Tener una cuenta aprobada no asegura la aprobación de Stripe u otra plataforma; cada entidad puede pedir documentos adicionales, entender mejor el modelo de negocio o limitar actividades según su política de riesgo.'] },
      { heading: 'Cómo presentar un caso coherente', bullets: ['Usá el mismo nombre legal, dominio, correo y descripción comercial en formularios, sitio y contratos.', 'Explicá qué vendés, quién compra, en qué moneda cobrás y cuál es el origen esperado de los fondos.', 'Conservá evidencia verificable: facturas, contratos, propuesta comercial o historial de ventas.', 'Respondé con precisión; no inventes dirección, residencia, clientes ni volumen para “encajar” en un requisito.'] },
      { heading: 'Prepará también la operación posterior', paragraphs: ['Antes de solicitar, definí quién podrá operar la cuenta, cómo se aprobarán pagos y dónde guardarás extractos y comprobantes. Una conciliación mensual simple y una política de gastos evitan que la cuenta de empresa se convierta en una extensión de la cuenta personal.'] },
    ],
  },
  {
    slug: 'registered-agent-que-hace',
    title: 'Registered Agent: qué recibe y qué responsabilidad sigue siendo tuya',
    seoTitle: 'Registered Agent: funciones y límites',
    description: 'El rol real del Registered Agent, por qué es obligatorio para una LLC y qué tareas estatales, fiscales y operativas no cubre por sí solo.',
    category: 'Cumplimiento', date: '2026-07-27', updated: '2026-08-26', readTime: '5 min', accent: 'sand',
    sections: [
      { paragraphs: ['La mayoría de los estados exige que una LLC mantenga un Registered Agent con dirección física local. Su función principal es recibir notificaciones oficiales y documentos legales durante el horario comercial.'] },
      { heading: 'Qué hace', bullets: ['Mantiene una dirección válida en el estado de registro.', 'Recibe correspondencia oficial y notificaciones judiciales.', 'Reenvía la documentación según el servicio contratado.'] },
      { heading: 'Qué no hace automáticamente', bullets: ['No presenta tu declaración federal.', 'No paga tasas estatales por vos salvo que el plan lo incluya.', 'No reemplaza la contabilidad ni el asesoramiento tributario.', 'No administra la cuenta bancaria de la LLC.'] },
      { heading: 'La clave es el seguimiento', paragraphs: ['Una notificación recibida y no atendida puede terminar en recargos o pérdida del good standing. Definí quién controla el correo, con qué frecuencia y cómo se escalan los avisos importantes.'] },
      { heading: 'Dirección registrada no es dirección operativa', paragraphs: ['El domicilio del Registered Agent cumple una función estatal concreta: recibir comunicaciones oficiales durante el horario requerido. No lo presentes como tu oficina, residencia o dirección para correspondencia comercial si el servicio no lo permite. Separar esos usos reduce inconsistencias en bancos, procesadores y registros públicos.'] },
      { heading: 'Preguntas para hacer antes de contratarlo', bullets: ['¿Qué documentos recibe y por qué canal los entrega?', '¿Qué plazo tiene la notificación y quién será el contacto de respaldo?', '¿El plan incluye renovación, cambio de agente o gestión de avisos estatales?', '¿Qué dirección puede usarse y para qué propósito, según las condiciones del servicio?'] },
      { heading: 'Tu responsabilidad sigue vigente', paragraphs: ['Delegar la recepción no delega las decisiones. El titular o administrador debe revisar renovaciones, tasas, reportes y comunicaciones tributarias. Configurá recordatorios propios y mantené datos de contacto actualizados para que un documento importante no dependa de una sola casilla de correo.'] },
    ],
  },
  {
    slug: 'calendario-anual-llc',
    title: 'Calendario anual de una LLC: cuatro controles para no trabajar a ciegas',
    seoTitle: 'Calendario anual para mantener tu LLC',
    description: 'Un sistema simple para ordenar reportes estatales, formularios federales, Registered Agent y registros contables durante el año de una LLC.',
    category: 'Cumplimiento', date: '2026-07-19', updated: '2026-08-26', readTime: '5 min', accent: 'lime',
    sections: [
      { paragraphs: ['El error más costoso suele ser tratar la apertura como el final del proceso. La LLC necesita mantenimiento y las fechas cambian según el estado, la cantidad de miembros y la situación fiscal.'] },
      { heading: 'Los cuatro controles', bullets: ['Estado: annual report, franchise tax o renovación aplicable.', 'Federación: formularios informativos y declaraciones según clasificación.', 'Registered Agent: vigencia del servicio y dirección actualizada.', 'Registros: conciliación bancaria, facturas, contratos y comprobantes.'] },
      { heading: 'Una rutina liviana', paragraphs: ['Armá una revisión mensual de movimientos y otra trimestral de documentación. Al comienzo de cada año, confirmá las fechas con un profesional que conozca tu estructura y tu residencia fiscal.'] },
      { heading: 'No copies el calendario de otra empresa', paragraphs: ['Dos LLC abiertas en el mismo estado pueden tener obligaciones distintas. La cantidad de socios, elecciones fiscales, actividad y países involucrados cambian el análisis.'] },
      { heading: 'Construí un calendario con fuentes y responsables', paragraphs: ['Anotá la fecha, la obligación, el organismo, el documento de respaldo y quién la revisa. Así el calendario deja de ser una lista de recordatorios aislados y se convierte en un sistema que otra persona también puede entender si cambia el administrador o el proveedor.'] },
      { heading: 'Revisión mensual de 30 minutos', bullets: ['Conciliá ingresos, gastos y saldo bancario contra facturas y comprobantes.', 'Archivá contratos, recibos y comunicaciones relevantes en una carpeta con permisos definidos.', 'Revisá cambios de dirección, miembros, actividad o datos de contacto.', 'Marcá obligaciones futuras y pedí ayuda profesional con anticipación cuando el caso lo exija.'] },
      { heading: 'Obligaciones federales y estatales son capas distintas', paragraphs: ['Que un estado no exija un reporte anual no significa que la LLC esté libre de obligaciones federales, tributarias o informativas. El calendario debe contemplar ambas capas y también los deberes que puedan surgir en el país donde se gestiona realmente el negocio.'] },
    ],
  },
  {
    slug: 'stripe-llc-cobros-internacionales',
    title: 'Stripe y una LLC: la infraestructura detrás de un cobro internacional',
    seoTitle: 'Stripe con una LLC: cobros internacionales',
    description: 'Cómo pensar la relación entre LLC, cuenta bancaria, procesador de pagos, políticas y documentación comercial cuando tu negocio vende globalmente.',
    category: 'Ventas globales', date: '2026-07-10', updated: '2026-08-26', readTime: '5 min', accent: 'coral',
    sections: [
      { paragraphs: ['Cobrar con tarjeta no depende de una sola cuenta. Hay una cadena: la entidad legal celebra contratos, el procesador gestiona el pago, el banco recibe los fondos y la contabilidad registra la operación.'] },
      { heading: 'Qué conviene alinear', bullets: ['Nombre legal y dirección en todos los perfiles.', 'Descripción del producto coherente con el sitio web.', 'Políticas de devolución, privacidad y términos visibles.', 'Cuenta bancaria a nombre de la empresa.', 'Soporte y datos de contacto verificables.'] },
      { heading: 'Riesgo y reservas', paragraphs: ['Los procesadores evalúan industria, historial, contracargos y claridad comercial. Una LLC habilita la estructura, pero no elimina controles ni asegura que toda actividad sea aceptada.'] },
      { heading: 'Diseñá el circuito antes de vender', paragraphs: ['Definí moneda, facturación, reintegros y registro contable antes de lanzar campañas. Ese trabajo reduce fricción cuando el volumen empieza a crecer.'] },
      { heading: 'La verificación pide que todo cuente la misma historia', paragraphs: ['Un procesador puede contrastar la información legal de la cuenta, la titularidad bancaria, la identidad de las personas responsables y el contenido del sitio. La descripción de tu producto, los precios, los plazos de entrega y la política de devolución deben ser reales, encontrables y coherentes con el flujo de cobro.'] },
      { heading: 'Antes de activar cobros con tarjeta', bullets: ['Publicá un contacto funcional, términos, privacidad y política de reembolsos adaptados a tu negocio.', 'Definí qué comprobante recibe el cliente y cómo responderás a reclamos o contracargos.', 'Verificá que el nombre de la cuenta bancaria y el de la entidad sean compatibles con el perfil.', 'No vendas productos, servicios o territorios restringidos por la plataforma o por la normativa aplicable.'] },
      { heading: 'Una LLC no sustituye el control de riesgo', paragraphs: ['La entidad puede ser parte de una infraestructura comercial válida, pero las revisiones continúan después de abrir la cuenta. Mantener documentos actualizados, responder a solicitudes a tiempo y entregar lo que efectivamente prometés es tan importante como completar el alta inicial.'] },
    ],
  },
  {
    slug: 'wyoming-o-new-mexico-llc',
    title: 'Wyoming o New Mexico: una comparación operativa para no residentes',
    seoTitle: 'Wyoming vs. New Mexico para tu LLC',
    description: 'Costos, mantenimiento y variables operativas para comparar Wyoming y New Mexico antes de registrar una LLC como titular no residente.',
    category: 'Primeros pasos', date: '2026-07-01', updated: '2026-08-26', readTime: '6 min', accent: 'gold',
    sections: [
      { paragraphs: ['No existe un estado perfecto para todos. El costo inicial es apenas una variable: también importan el mantenimiento, la privacidad registral, la actividad real y los planes de la empresa.'] },
      { heading: 'Wyoming', paragraphs: ['Suele ser considerado por sus costos relativamente contenidos y su marco empresarial conocido. Exige mantenimiento estatal periódico, por lo que conviene proyectar el costo recurrente.'] },
      { heading: 'New Mexico', paragraphs: ['Atrae a operaciones simples por su mantenimiento estatal particular y una exposición registral acotada en ciertos datos. Eso no elimina las obligaciones federales ni las reglas del país donde vive el titular.'] },
      { heading: 'Cómo decidir', bullets: ['Dónde ocurre realmente la actividad.', 'Qué esperan bancos, clientes o inversores.', 'Costo total a tres años, no sólo el alta.', 'Necesidad de cambios societarios futuros.'], note: 'La elección del estado debe seguir al modelo de negocio; no al revés.' },
      { heading: 'Compará obligaciones, no sólo el precio de apertura', paragraphs: ['Los importes y formularios estatales cambian, por lo que conviene confirmar siempre la información en el sitio oficial antes de registrar. La comparación útil incorpora tasa inicial, renovación, Registered Agent, tiempos administrativos y la carga de seguir activo cada año. Un costo bajo puede dejar de serlo si el proceso no encaja con tu operación.'] },
      { heading: 'Variables que suelen inclinar la balanza', bullets: ['Si la empresa realmente opera, tiene personal o presencia en un estado, puede requerir registro allí aunque se haya formado en otro.', 'La exposición pública de determinados datos y las reglas de mantenimiento no son idénticas.', 'Bancos, clientes e inversores pueden tener requisitos propios, separados de la norma estatal.', 'La tributación federal, la residencia fiscal del titular y la actividad efectiva se analizan aparte de la elección del estado.'] },
      { heading: 'Tomá la decisión con un escenario escrito', paragraphs: ['Documentá dónde vivís, dónde trabajás, qué vendés, quiénes serán los clientes, qué entidades de cobro usarás y cómo evolucionará la empresa. Ese escenario permite recibir una recomendación más responsable que elegir por una lista de “mejores estados” publicada en internet.'] },
    ],
  },
  {
    slug: 'operating-agreement-llc-un-miembro',
    title: 'Operating Agreement de un solo miembro: por qué conviene tenerlo',
    seoTitle: 'Operating Agreement para LLC unipersonal',
    description: 'Para qué sirve el Operating Agreement incluso cuando una LLC tiene un único titular, qué decisiones documenta y cuándo conviene actualizarlo.',
    category: 'Operaciones', date: '2026-06-23', updated: '2026-08-26', readTime: '5 min', accent: 'sand',
    sections: [
      { paragraphs: ['Aunque el estado no siempre pida presentarlo, el Operating Agreement funciona como el manual interno de la LLC. Explica quién controla la entidad y bajo qué reglas toma decisiones.'] },
      { heading: 'Qué suele documentar', bullets: ['Identidad y aporte del titular.', 'Facultades de administración y firma.', 'Tratamiento de distribuciones.', 'Separación entre titular y entidad.', 'Procedimiento ante incapacidad, transferencia o cierre.'] },
      { heading: 'Por qué lo piden terceros', paragraphs: ['Un banco, procesador o contraparte puede usarlo para verificar quién tiene autoridad. Mantenerlo firmado y consistente con los registros estatales evita demoras.'] },
      { heading: 'Actualizalo cuando cambie la realidad', paragraphs: ['Si ingresa un socio, cambia la administración o se reorganiza la propiedad, el documento debe revisarse. Un modelo genérico puede servir como punto de partida, pero no sustituye una redacción adecuada al caso.'] },
      { heading: 'Qué aporta a una LLC de un solo miembro', paragraphs: ['En una LLC unipersonal no hay socios con quienes negociar reglas, pero sí conviene dejar constancia de quién es el miembro, quién administra, cómo se autorizan decisiones y cómo se separan fondos. También ayuda a explicar esa estructura a un banco, un procesador o una contraparte que necesita verificar facultades.'] },
      { heading: 'Puntos que vale la pena revisar', bullets: ['Nombre legal y estado de formación correctamente escritos.', 'Identidad del miembro, aportes y facultades de gestión.', 'Criterio para firmar contratos, abrir cuentas y hacer distribuciones.', 'Reglas para incorporar un miembro, transferir intereses o disolver la entidad.', 'Fecha, firmas y una copia guardada junto con el resto de documentos corporativos.'] },
      { heading: 'No lo uses como una plantilla inmutable', paragraphs: ['El Operating Agreement es un documento interno que debe reflejar la realidad. Si sumás un socio, delegás la administración o cambiás el modelo de negocio, revisalo antes de que una verificación revele contradicciones entre lo que firmaste y cómo funciona la empresa.'] },
    ],
  },
];

export const categories = ['Todas', ...new Set(posts.map((post) => post.category))] as const;
export const findPost = (slug: string) => posts.find((post) => post.slug === slug);
