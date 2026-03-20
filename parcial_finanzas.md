Primer Parcial Web: Desarrollo de Frontend para Sistema de Finanzas Personales 
20	de	Marzo	de	2026	
Se	dispone	de	una	API	REST	para	la	gestión	de	
finanzas	personales.	Cada	estudiante	deberá	
construir	una	aplicación	web	que	consuma	dicha	API	
y	permita	gestionar	información	financiera	básica	
dentro	de	un	workspace.	
El	sistema	debe	diseñarse	a	partir	del	análisis	de	los	
endpoints	disponibles	en	Swagger,	los	JSON	de	
entrada	y	salida,	y	el	modelo	de	datos	suministrado	
por	el	docente.	
Objetivo 
Desarrollar	una	aplicación	web	funcional	que	permita	
a	un	usuario	autenticarse,	obtener	su	workspace,	
crear	categorías	y	registrar	movimientos	financieros	
para	ver	su	dashboard	grafico.	
Reglas del modelo -	Debe	existir	al	menos	una	categoría	antes	de	
registrar	movimientos.	-	Las	categorías	solo	pueden	ser	de	tipo	INGRESO	o	
GASTO	(en	mayúscula).	-	El	sistema	trabaja	sobre	un	workspace.	-	El	workspace	debe	ser	usado	en	los	servicios	
correspondientes.	
Alcance mínimo 
1.	Autenticación	(registro/login)	
2.	Gestión	de	workspace	
3.	Gestión	de	categorías	
4.	Registro	de	ingresos	y	gastos	
5.	Registro	de	beneficiarios	
6.	Visualización	de	información	
Flujo sugerido 
1.	Login	
2.	Obtener	workspace	
3.	Crear	categorías	
4.	Registrar	beneficiarios		
5.	Registrar	ingresos/gastos	
Requerimientos técnicos -	Uso	de	HTML,	CSS	y	JS	(Sin	JQuery)	-	Consumo	de	API	con	fetch	o	axios	-	Manejo	de	sesión	-	Interfaz	usable	(Ajustada	para	móviles	y	desktop)	-	Validaciones	y	manejo	de	errores	
Entregables -	Aplicación	funcional	-	Código	en	repositorio	-	Despliegue	en	GitHub	Pages	
Evaluación -	Interpretación	de	API:	20%	-	Flujo	funcional:	25%	-	Workspace	y	categorías:	15%	-	Diseño:	15%	-	Validaciones:	10%	-	Código:	15%	
Url:	https://finanzas-api.ubunifusoft.digital/swagger-ui/index.html		
6.	Visualizar	información	en	el	dashboard