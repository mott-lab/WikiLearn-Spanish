// This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
// Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
// session persistence, api calls, and more.
const Alexa = require('ask-sdk-core');
const persistenceAdapter = require('ask-sdk-s3-persistence-adapter');

// set later from user input
let preferredReadingStyle; 
let preferredCategory;

const articleData = {
    "people": [
            {
                "en": {
                    "title": "<lang xml:lang='es-ES'>Hernán Cortés</lang>",
                    "paragraphs": [
                        "<lang xml:lang='es-ES'>Hernán Cortés de Monroy y Pizarro Altamirano, Marquis of the Valley of Oaxaca</lang>; (1485 – December 2, 1547) was a Spanish Conquistador who led an expedition that caused the fall of the Aztec Empire and brought large portions of what is now mainland Mexico under the rule of the King of Castile in the early 16th century. <lang xml:lang='es-ES'>Cortés</lang> was part of the generation of Spanish colonizers who began the first phase of the Spanish colonization of the Americas. ",
                        "Born in <lang xml:lang='es-ES'>Medellín</lang>, Spain, to a family of lesser nobility, <lang xml:lang='es-ES'>Cortés</lang> chose to pursue adventure and riches in the New World. He went to Hispaniola and later to Cuba, where he received an <lang xml:lang='es-ES'>encomienda</lang> (the right to the labor of certain subjects). For a short time, he served as <lang xml:lang='es-ES'>alcalde</lang> (magistrate) of the second Spanish town founded on the island. In 1519, he was elected captain of the third expedition to the mainland, which he partly funded. His enmity with the Governor of Cuba, <lang xml:lang='es-ES'>Diego Velázquez de Cuéllar</lang>, resulted in the recall of the expedition at the last moment, an order which <lang xml:lang='es-ES'>Cortés</lang> ignored. ",
                        "Arriving on the continent, <lang xml:lang='es-ES'>Cortés</lang> executed a successful strategy of allying with some indigenous people against others. He also used a native woman, <lang xml:lang='es-ES'>Doña Marina</lang>, as an interpreter. She later bore his first son. When the Governor of Cuba sent emissaries to arrest <lang xml:lang='es-ES'>Cortés</lang>, he fought them and won, using the extra troops as reinforcements. <lang xml:lang='es-ES'>Cortés</lang> wrote letters directly to the king asking to be acknowledged for his successes instead of being punished for mutiny. After he overthrew the Aztec Empire, <lang xml:lang='es-ES'>Cortés</lang> was awarded the title of <lang xml:lang='es-ES'>Marqués del Valle de Oaxaca</lang>, while the more prestigious title of Viceroy was given to a high-ranking nobleman, <lang xml:lang='es-ES'>Antonio de Mendoza</lang>. In 1541 <lang xml:lang='es-ES'>Cortés</lang> returned to Spain, where he died six years later of natural causes but embittered. "
                    ]
                }, 
                "es": {
                    "title": "Hernán Cortés",
                    "paragraphs": [
                        "Hernán Cortés de Monroy y Pizarro Altamirano, I marqués del Valle de Oaxaca (Medellín, Corona de Castilla, 1485 - Castilleja de la Cuesta, Corona de Castilla, 2 de diciembre de 1547) fue un conquistador español que, a principios del siglo XVI, lideró la expedición que inició la conquista de México y el final del imperio mexica, poniéndolo bajo dominio de la Corona de Castilla —al cual se denominó Nueva España. ",
                        "Nació en la ciudad de Medellín, Badajoz, Extremadura, en el seno de una familia de menor hidalguía​. Decidió buscar fortuna en el Nuevo Mundo viajando a La Española y Cuba, donde por un corto periodo de tiempo fue alcalde de la segunda ciudad fundada por los españoles en esa isla. En 1519 fue elegido capitán de la tercera expedición a tierra firme, la cual financió parcialmente. Su enemistad con el gobernador de Cuba, Diego Velázquez de Cuéllar, provocó la cancelación del viaje a última hora, una orden que Cortés ignoró. ",
                        "Llegando al continente, Cortés realizó una exitosa estrategia de aliarse con determinados grupos indígenas para derrotar a otros. También utilizó una mujer nativa, doña Marina (la Malinche), que le sirvió de intérprete y con quien tuvo un hijo. Cuando el gobernador de Cuba mandó emisarios para apresar a Cortés, este los enfrentó y derrotó, al tiempo que enroló a la tropa que iba a arrestarlo como refuerzos para su expedición. Cortés mandó varias cartas al rey Carlos I a fin de que fuese reconocido su éxito de conquista en lugar de ser penalizado por su amotinamiento. Finalmente le fue concedido el título de marqués del Valle de Oaxaca, si bien el más prestigioso título de virrey le fue dado a un aristócrata de alto rango, Antonio de Mendoza y Pacheco. En 1541, Cortés retornó a España, donde falleció seis años después, arrastrando su amargura. "
                    ]
                }
            },
            {
                "en": {
                    "title": "Felipe González",
                    "paragraphs": [
                        "<lang xml:lang='es-ES'>Felipe González Márquez</lang> (born 5 March 1942) is a Spanish lawyer, professor, and politician, who was the Secretary-General of the Spanish Socialist Workers' Party (PSOE) from 1974 to 1997, and the 3rd Prime Minister of Spain since the restoration of democracy, from 1982 to 1996. To date, he remains the longest-serving Prime Minister of Spain to be freely elected. ",
                        "González joined the PSOE in 1964, when it was banned under the Francoist regime. He obtained a law degree from the University of Seville in 1965. In 1974, the PSOE elected González as its Secretary-General after a split in its 26th Congress. After Franco's death and the beginning of the Spanish transition to democracy, González obtained a seat in the Congress of Deputies after he led the PSOE candidacy in the 1977 general election, but lost to Adolfo Suárez. ",
                        "After the PSOE victory in the 1982 general election, González formed his first majority government, backed by 202 out of the 350 deputies at the Congress of Deputies, and led the Government of Spain for thirteen and a half years after three additional victories in the 1986, 1989 and 1993 general elections. In 1996, González lost the election to José María Aznar and the People's Party and was elected to the Congress of Deputies for the last time in the 2000 general election, from Seville. "
                    ]
                },
                "es": {
                    "title": "Felipe González",
                    "paragraphs": [
                        "Felipe González Márquez (Sevilla, 5 de marzo de 1942) es un abogado, profesor universitario y político español. Fue secretario general del Partido Socialista Obrero Español (PSOE) desde 1974 hasta 1997 y tercer presidente del Gobierno de España desde la reinstauración de la democracia, entre 1982 y 1996. ",
                        "En 1962 se afilió a las Juventudes Socialistas y se incorporó al PSOE en 1964, entonces un partido clandestino. Al año siguiente finalizó sus estudios de derecho en la Universidad de Sevilla. Participó en manifestaciones contra la dictadura de Francisco Franco, hecho por el que llegó a ser detenido en Madrid en 1971. En el Congreso de Suresnes de 1974 del PSOE renovado (escisión del PSOE dirigido por Rodolfo Llopis), Felipe González fue elegido secretario general del PSOE. Ya en democracia, obtuvo su primer acta de diputado en 1977 y fue el candidato del PSOE a la presidencia del Gobierno en 1977, 1979, 1982, 1986, 1989, 1993 y 1996. ",
                        "Tras obtener el PSOE la mayoría absoluta en las elecciones de 1982, fue investido presidente del Gobierno. Su mandato de trece años y medio fue el período más largo de un jefe de Gobierno de la democracia en España. Bajo su dirección el PSOE logró dos mayorías absolutas consecutivas: la de 1982, con 202 diputados en el Congreso, y en 1986, elecciones en las que obtuvo 184 diputados; asimismo, en 1989 obtuvo 175 diputados, exactamente la mitad de los que componen el hemiciclo. En 1993 el PSOE perdió la mayoría absoluta, requiriendo el apoyo de Convergència i Unió para la formación de gobierno. Tras las generales de 1996, en las que el PSOE resultó derrotado al lograr 141 diputados frente a los 156 que consiguió el Partido Popular, González salió de la presidencia del gobierno, sucedido por José María Aznar. Fue elegido diputado por última vez en 2000, año en el que concurrió a las elecciones por la circunscripción electoral de Sevilla. "
                    ]
                }
            },
            {
                "en": {
                    "title": "Salvador Dalí",
                    "paragraphs": [
                        "Salvador Domingo Felipe Jacinto Dalí i Domènech, 1st Marquis of Dalí de Púbol (11 May 1904 – 23 January 1989), known professionally as Salvador Dalí, was a prominent Spanish surrealist born in Figueres, Catalonia, Spain. ",
                        "Dalí was a skilled draftsman, best known for the striking and bizarre images in his surrealist work. His painterly skills are often attributed to the influence of Renaissance masters. His best-known work, The Persistence of Memory, was completed in August 1931. Dalí's expansive artistic repertoire included film, sculpture, and photography, at times in collaboration with a range of artists in a variety of media. ",
                        "Dalí attributed his \"love of everything that is gilded and excessive, my passion for luxury and my love of oriental clothes\" to an \"Arab lineage\", claiming that his ancestors were descendants of the Moors. Dalí was highly imaginative, and also enjoyed indulging in unusual and grandiose behavior. To the dismay of those who held his work in high regard, and to the irritation of his critics, his eccentric manner and attention-grabbing public actions sometimes drew more attention than his artwork. "
                    ]
                },
                "es": {
                    "title": "Salvador Dalí",
                    "paragraphs": [
                        "Salvador Felipe Jacinto Dalí i Domènech,​ marqués de Dalí de Púbol (Figueras, 11 de mayo de 1904-ibídem, 23 de enero de 1989), fue un pintor, escultor, grabador, escenógrafo y escritor español del siglo XX. Se le considera uno de los máximos representantes del surrealismo. ",
                        "Salvador Dalí es conocido por sus impactantes y oníricas imágenes surrealistas. Sus habilidades pictóricas se suelen atribuir a la influencia y admiración por el arte renacentista. También fue un experto dibujante.​Los recursos plásticos dalinianos también abordaron el cine, la escultura y la fotografía, lo cual le condujo a numerosas colaboraciones con otros artistas audiovisuales. Tuvo la capacidad de acrisolar un estilo genuinamente personal y palpable al primer contacto, que en realidad era muy ecléctico y que «succionó» de innovaciones ajenas. Una de sus pinturas más célebres es La persistencia de la memoria (también conocida como Los relojes blandos), realizada en 1931. ",
                        "Como artista extremadamente imaginativo, manifestó una notable tendencia al narcisismo y la megalomanía, cuyo objeto era atraer la atención pública. Esta conducta irritaba a quienes apreciaban su arte y justificaba a sus críticos, que rechazaban sus conductas excéntricas como un reclamo publicitario ocasionalmente más llamativo que su producción artística.​ Dalí atribuía su «amor por todo lo que es dorado y resulta excesivo, su pasión por el lujo y su amor por la moda oriental» a un autoproclamado linaje arábigo,​ que remontaba sus raíces a los tiempos de la dominación árabe de la península ibérica. "
                    ]
                }
            },
            {
            "en": {
                "title": "Óscar Romero",
                "paragraphs": [
                    "Saint Óscar Arnulfo Romero y Galdámez (15 August 1917 – 24 March 1980) was a prelate of the Catholic Church in El Salvador who served as the fourth Archbishop of San Salvador. He spoke out against poverty, social injustice, assassinations, and torture. In 1980, Romero was assassinated while celebrating Mass in the chapel of the Hospital of Divine Providence. Though no one was ever convicted for the crime, investigations by the UN-created Truth Commission for El Salvador concluded that the extreme right-wing politician, founder of ARENA and death squad leader Roberto D'Aubuisson had given the order. ",
                    "During Romero's beatification, Pope Francis stated, \"His ministry was distinguished by his particular attention to the most poor and marginalized.\" Hailed as a hero by supporters of liberation theology inspired by his work, Romero, according to his biographer, \"was not interested in liberation theology\" but faithfully adhered to Catholic teachings on liberation and a preferential option for the poor, desiring a social revolution based on interior reform. Up to the end of his life, his spiritual life drew much from the spirituality of Opus Dei. While seen as a social conservative at his appointment as archbishop in 1977, he was deeply affected by the murder of his friend and fellow priest Rutilio Grande a few weeks after his own appointment and subsequently developed into an outspoken social activist. ",
                    "In 2010, the United Nations General Assembly proclaimed 24 March as the \"International Day for the Right to the Truth Concerning Gross Human Rights Violations and for the Dignity of Victims\" in recognition of the role of Archbishop Romero in defence of human rights. Romero actively denounced violations of the human rights of the most vulnerable people and defended the principles of protecting lives, promoting human dignity and opposing all forms of violence. In 1997, Pope John Paul II bestowed upon Romero the title of Servant of God, and a cause for beatification and canonization was opened for him. The cause stalled, but was reopened by Pope Benedict XVI in 2012. He was declared a martyr by Pope Francis on 3 February 2015, paving the way for his beatification on 23 May 2015. Pope Francis canonized Romero as a saint on 14 October 2018. ",
                    "His successor, the incumbent Metropolitan Archbishop of the Roman Catholic Archdiocese of San Salvador, El Salvador, Archbishop Jose Luis Escobar Alas, has asked Pope Francis to proclaim Archbishop Saint Romero a Doctor of the Church, which is an acknowledgement from the Church that his religious teachings were orthodox and had a significant impact on its philosophy and theology. ",
                    "Latin American church groups often proclaim Romero an unofficial patron saint of the Americas and El Salvador; Catholics in El Salvador often refer to him as \"San Romero\", as well as \"Monseñor Romero\". Outside of Catholicism, Romero is honored by other Christian denominations including Church of England and Anglican Communion through the Calendar in Common Worship, as well as in at least one Lutheran liturgical calendar. Archbishop Romero is also one of the ten 20th-century martyrs depicted in statues above the Great West Door of Westminster Abbey in London. In 2008, Europe-based magazine A Different View included Romero among its 15 Champions of World Democracy. "
                ]
            },
            "es": {
                "title": "Óscar Arnulfo Romero",
                "paragraphs": [
                    "Óscar Arnulfo Romero y Galdámez (Ciudad Barrios, 15 de agosto de 1917 – San Salvador, 24 de marzo de 1980), conocido como monseñor Romero,​ fue un sacerdote católico salvadoreño y el cuarto arzobispo metropolitano de San Salvador (1977-1980), célebre por su prédica en defensa de los derechos humanos y por haber sido asesinado durante la celebración de la misa en la capilla del hospital Divina Providencia. La orden de su asesinato oficialmente nunca se ha confirmado. La Iglesia católica lo venera como santo y algunos de sus fieles se refieren a él como san Romero de América. ",
                    "Como arzobispo, denunció en sus homilías dominicales numerosas violaciones de los derechos humanos y manifestó en público su solidaridad hacia las víctimas de la violencia política de su país. Su asesinato provocó la protesta internacional en demanda del respeto a los derechos humanos en El Salvador. Dentro de la Iglesia católica se consideró un obispo que defendía la «opción preferencial por los pobres». En una de sus homilías, afirmó: «La misión de la Iglesia es identificarse con los pobres, así la Iglesia encuentra su salvación» (11 de noviembre de 1977). Sus acciones son admiradas por los seguidores de la teología de la liberación; sin embargo, según su secretario, Romero no estaba interesado en ella.​",
                    "El 24 de marzo de 1990 se dio inicio a la causa de canonización de monseñor Romero. En 1994 se presentó de modo formal la solicitud para su canonización a su sucesor Arturo Rivera y Damas. A partir de ese proceso, monseñor Romero recibió el título de Siervo de Dios.​ El 3 de febrero de 2015 fue reconocido como mártir «por odio a la fe» por parte de la Iglesia católica, al ser aprobado por el papa Francisco el decreto de martirio correspondiente y promulgado por la Congregación para las Causas de los Santos. Por eso mismo, en consonancia con los procesos debidos según los estipula la misma Iglesia católica, el 23 de mayo de 2015 fue beatificado en la plaza Salvador del Mundo. Poco más de tres años más tarde, el 14 de octubre de 2018 fue canonizado por el papa Francisco en la plaza de San Pedro en Roma.​Óscar Romero goza de las siguientes particularidades: Se trata del primer salvadoreño en ser elevado a los altares; el primer arzobispo mártir de América; el primero en ser declarado mártir ulterior al Concilio Vaticano II; el primer santo nativo de Centroamérica,​ ya que, si bien es cierto el santo hermano Pedro de San José de Betancur realizó toda su obra por la que fue canonizado en la ciudad de Santiago de los Caballeros de Guatemala y, por tanto, también un santo centroamericano, sus orígenes se encuentran en Tenerife, España.​ Además, la santificación por parte de la Iglesia católica no es la primera que ha recibido, puesto que la Iglesia anglicana ya lo había incluido en su santoral oficial,​ así como la Iglesia luterana también ya lo había incluido en su calendario litúrgico. ",
                    "Fuera de la Iglesia católica, Romero es honrado por otras denominaciones religiosas de la cristiandad, incluyendo a la Comunión anglicana y el luteranismo, como ya se había mencionado antes. En la comunión anglicana, es uno de los diez mártires del siglo XX representados en las estatuas de la abadía de Westminster, en Londres. Óscar Romero es admirado aún fuera del mundo cristiano, llegando, incluso, a ser valorado en los círculos irreligiosos. ",
                    "En 1979 fue nominado al Premio Nobel de la Paz, a propuesta del Parlamento del Reino Unido. Sin embargo, la laureada con este galardón ese año fue Teresa de Calcuta. "
                ]
            },
        }
            
        ],
    "places": [
        {
            "en": {
                "title": "Strait of Gibraltar",
                "paragraphs": [
                    "The Strait of Gibraltar is a narrow strait that connects the Atlantic Ocean to the Mediterranean Sea and separates Gibraltar and Peninsular Spain in Europe from Morocco  and Ceuta (Spain) in Africa. The name comes from the Rock of Gibraltar, which in turn originates from the Arabic Jebel Tariq (meaning \"Mount Tariq\") named after Tariq ibn Ziyad. It is also known as the Straits of Gibraltar, the Gut of Gibraltar (although this is mostly archaic), the STROG (Strait Of Gibraltar) in naval use, and Bab Al Maghrib, \"Gate of the West\". In the Middle Ages, Muslims called it Al-Zuqaq, \"The Passage\", the Romans called it Fretum Gatitanum (Strait of Cadiz), and in the ancient world it was known as the \"Pillars of Hercules\". ",
                    "Europe and Africa are separated by 7.7 nautical miles (14.3 km; 8.9 mi) of ocean at the strait's narrowest point. The Strait's depth ranges between 300 and 900 metres (160 and 490 fathoms; 980 and 2,950 ft) which possibly interacted with the lower mean sea level of the last major glaciation 20,000 years ago when the level of the sea is believed to have been lower by 110–120 m (60–66 fathoms; 360–390 ft). Ferries cross between the two continents every day in as little as 35 minutes. The Spanish side of the Strait is protected under El Estrecho Natural Park. "
                ]
            },
            "es": {
                "title": "Estrecho de Gibraltar",
                "paragraphs": [
                    "El estrecho de Gibraltar es el lugar por donde se produce la unión natural de dos masas de agua: el mar Mediterráneo y el océano Atlántico y la separación entre dos continentes: Europa y África. Incluso geológicamente, el estrecho representa la fisura de las dos placas tectónicas: la Euroasiática y la Africana. Es una de las vías de navegación más importantes del mundo al dar acceso al océano Atlántico y el mar Mediterráneo, el cual a su vez comunica con el Oriente Próximo y Asia por el canal de Suez. En navegación marítima se abrevia como STROG (del inglés: Strait Of Gibraltar).​ En la Edad Antigua también se menciona como las Columnas de Hércules. ",
                    "En su punto más estrecho, Europa y África están separadas por 14,4 kilómetros de océano. Tiene una profundidad de 300 a 900 metros. Se sabe que hace cinco millones de años quedó geológicamente cerrado, provocando la desecación del mar Mediterráneo, en lo que se conoce como crisis salina del Messiniense. En la actualidad, es un lugar de paso importante para la fauna, tanto de aves migratorias que viajan estacionalmente entre Europa y África, como de cetáceos entre el Mediterráneo y el Atlántico. Por eso, la costa peninsular española está protegida por el Parque natural del Estrecho. "
                ]
            }
        },
        {
            "en": {
                "title": "Teide",
                "paragraphs": [
                    "Mount Teide (Spanish: <lang xml:lang='es-ES'>El Teide, Pico del Teide</lang>) is a volcano on Tenerife in the Canary Islands, Spain. Its 3,718-metre (12,198 ft) summit is the highest point in Spain and the highest point above sea level in the islands of the Atlantic. ",
                    "If measured from the ocean floor, it is at 7,500 m (24,600 ft) the highest volcano in the world base-to-peak outside of the Hawaiian Islands, and is described by UNESCO and NASA as Earth's third-tallest volcanic structure. Teide's elevation makes Tenerife the tenth highest island in the world. Teide is an active volcano: its most recent eruption occurred in 1909 from the El Chinyero vent on the northwestern Santiago rift. The United Nations Committee for Disaster Mitigation designated Teide a Decade Volcano because of its history of destructive eruptions and its proximity to several large towns, of which the closest are Garachico, Icod de los Vinos and Puerto de la Cruz. Teide, Pico Viejo and Montaña Blanca form the Central Volcanic Complex of Tenerife. ",
                    "The volcano and its surroundings comprise Teide National Park, which has an area of 18,900 hectares (47,000 acres) and was named a World Heritage Site by UNESCO on June 28, 2007. Teide is the most visited natural wonder of Spain, the most visited national park in Spain and Europe and – by 2015 – the eighth most visited in the world, with some 3 million visitors yearly. In 2016, it was visited by 4,079,823 visitors and tourists reaching a historical record. Teide Observatory, a major international astronomical observatory, is located on the slopes of the mountain. "
                ]
            },
            "es": {
                "title": "Teide",
                "paragraphs": [
                    "El Teide es un volcán situado en la isla de Tenerife (Canarias, España). Tiene una altitud de 3.718​ metros sobre el nivel del mar y 7.500 metros sobre el lecho oceánico, es el pico más alto del país, el de cualquier tierra emergida del océano Atlántico y el tercer mayor volcán de la Tierra desde su base en el lecho oceánico, después del Mauna Kea y el Mauna Loa, ambos en Hawái.​ La altitud del Teide convierte además a la isla de Tenerife en la décima isla más alta del mundo. ",
                    "El Teide forma parte del Parque nacional del Teide, declarado Patrimonio de la Humanidad por la UNESCO, el 28 de junio de 2007. Es además un espacio natural protegido en la categoría de Monumento Natural que encierra el complejo volcánico Teide-Pico Viejo, un gran estratovolcán de tipo vesubiano que se mantiene inactivo desde las erupciones históricas ocurridas no hace demasiado tiempo (la última, la de Narices del Teide, en 1798) y las fumarolas que emite regularmente desde su cráter. ",
                    "El Teide es considerado el monumento natural más emblemático del Archipiélago Canario.​ También es un gran atractivo turístico que cada año atrae a millones de personas; de hecho el Parque nacional del Teide es el parque nacional más visitado de España. En 2016 el número de visitantes ascendió a 4,079,823, batiendo un récord histórico.​​ En 2010 se situó como el parque nacional más visitado de Europa y el segundo parque nacional más visitado del mundo. "
                ]
            }
        },
        {
            "en": {
                "title": "Torres del Paine National Park",
                "paragraphs": [
                    "Torres del Paine National Park (Spanish: <lang xml:lang='es-ES'>Parque Nacional Torres del Paine</lang>) is a national park encompassing mountains, glaciers, lakes, and rivers in southern Chilean Patagonia. The <lang xml:lang='es-ES'>Cordillera del Paine</lang> is the centerpiece of the park. It lies in a transition area between the Magellanic subpolar forests and the Patagonian Steppes. The park is located 112 km (70 mi) north of Puerto Natales and 312 km (194 mi) north of Punta Arenas. The park borders Bernardo O'Higgins National Park to the west and the Los Glaciares National Park to the north in Argentine territory.  Paine means \"blue\" in the native Tehuelche (Aonikenk) language and is pronounced PIE-nay. ",
                    "Torres del Paine National Park is part of the Sistema Nacional de Áreas Silvestres Protegidas del Estado de Chile (National System of Protected Forested Areas of Chile). In 2013, it measured approximately 181,414 hectares. It is one of the largest and most visited parks in Chile. The park averages around 252,000 visitors a year, of which 54% are foreign tourists, who come from many countries all over the world. It is also part of the End of the World Route, a tourist scenic route. ",
                    "The park is one of the 11 protected areas of the Magallanes Region and Chilean Antarctica (together with four national parks, three national reserves, and three national monuments). Together, the protected forested areas comprise about 51% of the land of the region (6,728,744 hectares). ",
                    "The Torres del Paine are the distinctive three granite peaks of the Paine mountain range or Paine Massif. From left to right they are known as Torres d'Agostini, Torres Central and Torres Monzino.  They extend up to 2,500 metres (8,200 ft) above sea level, and are joined by the Cuernos del Paine. The area also boasts valleys, rivers such as the Paine, lakes, and glaciers. The well-known lakes include Grey, Pehoé, Nordenskiöld, and Sarmiento. The glaciers, including Grey, Pingo and Tyndall, belong to the Southern Patagonia Ice Field. "
                ]
            },
            "es": {
                "title": "Parque nacional Torres del Paine",
                "paragraphs": [
                    "El parque nacional Torres del Paine es uno de los más grandes e importantes parques nacionales de Chile, y un área silvestre protegida. En 2006, ocupaba una superficie de 242 242 ha, aproximadamente. Es el tercero con más visitas, de las cuales cerca del 75% corresponde a turistas extranjeros, especialmente europeos. Se ubica a 112 km al norte de Puerto Natales y a 312 de la ciudad de Punta Arenas. ",
                    "En una edición especial de National Geographic, las torres del Paine fueron escogidas como el quinto lugar más hermoso del mundo.​ El parque fue seleccionado como la octava maravilla del mundo en 2013, luego de que recibiera más de cinco millones de votos en el concurso que realizó el sitio Virtual Tourist. ",
                    "Es una de las once áreas protegidas existentes en la región de Magallanes y de la Antártica Chilena (junto con otros cuatro parques nacionales, tres reservas nacionales y tres monumentos nacionales). En conjunto, las áreas silvestres protegidas abarcan un 51% de la superficie de la región (6 728 744 ha). ",
                    "Presenta una gran variedad de entornos naturales: montañas (entre las que destacan el complejo del cerro Paine —cuya cumbre principal alcanza los 3050 msnm— las Torres del Paine y los Cuernos del Paine), valles, ríos (como el río Paine), lagos (destacando los conocidos como Grey, Pehoé, Nordenskjöld y Sarmiento), glaciares (Grey, Pingo, Tyndall y Geikie, pertenecientes al Campo de Hielo Patagónico Sur). "
                ]
            }
        },
        {
            "en": {
                "title": "Cape Horn",
                "paragraphs": [
                    "Cape Horn (Spanish: <lang xml:lang='es-ES'>Cabo de Hornos</lang>) is the southernmost headland of the Tierra del Fuego archipelago of southern Chile, and is located on the small Hornos Island. Although not the most southerly point of South America (which are the Diego Ramírez Islands), Cape Horn marks the northern boundary of the Drake Passage and marks where the Atlantic and Pacific Oceans meet. ",
                    "Cape Horn was discovered and first rounded in 1616 by the Dutchman Willem Schouten, who named it Kaap Hoorn  after the city of Hoorn in the Netherlands. For decades, Cape Horn was a major milestone on the clipper route, by which sailing ships carried trade around the world. The waters around Cape Horn are particularly hazardous, owing to strong winds, large waves, strong currents and icebergs; these dangers have made it notorious as a sailors' graveyard. ",
                    "The need for boats and ships to round Cape Horn was greatly reduced by the opening of the Panama Canal in August 1914. However, sailing around the Cape Horn is still widely regarded as one of the major challenges in yachting. Thus a few recreational sailors continue to sail this route, sometimes as part of a circumnavigation of the globe. Almost all of these choose routes through the channels to the north of the Cape. (Many take a detour through the islands and anchor to wait for fair weather to visit Horn Island, or sail around it to replicate a rounding of this historic point.) Several prominent ocean yacht races, notably the Volvo Ocean Race, the VELUX 5 Oceans, and the Vendée Globe, sail around the world via the Horn. Speed records for round-the-world sailing are recognized for following this route. "
                ]
            },
            "es": {
                "title": "Cabo de Hornos",
                "paragraphs": [
                    "Cabo de Hornos es el cabo más meridional de la isla de Hornos y del archipiélago de Tierra del Fuego, en la Zona austral de Chile, tradicionalmente considerado como el punto más meridional de América —aunque, en realidad, éste corresponde al islote Águila en el archipiélago de las islas Diego Ramírez—. Es el más austral de los tres grandes cabos del hemisferio sur del planeta y marca el límite norte del Pasaje de Drake, que separa a América de la Antártica o Antártida,​ y une el océano Pacífico con el océano Atlántico. ",
                    "Navegar en sus aguas aún está considerado como uno de los mayores retos náuticos, por lo que existen diversos eventos deportivos y turísticos que utilizan este paso, algunos como parte de la circunnavegación al globo, entre los que destacan importantes regatas de yates, como el Vendée Globe. ",
                    "Durante muchos años, el cabo de Hornos fue uno de los hitos de las rutas comerciales de navegación de embarcaciones a vela, pese a que las aguas en torno al Cabo son particularmente peligrosas, debido a sus fuertes vientos y oleaje y la presencia de icebergs. Sin embargo, con la apertura del canal de Panamá y la construcción de carreteras y ferrocarriles en otros países del continente, la navegación mercante alrededor del cabo se redujo notablemente, siendo utilizado en la actualidad solo por naves cuyo gran tamaño les imposibilita el paso por el canal, como portaaviones o petroleros. "
                ]
            }
        },
        {
            "en": {
                "title": "Jesuit Block and Estancias of Córdoba",
                "paragraphs": [
                    "The Jesuit Block and Estancias of Córdoba (Spanish: <lang xml:lang='es-ES'>Manzana Jesuítica y Estancias de Córdoba</lang>) are a former Jesuit reduction built by missionaries in the  province of Córdoba, Argentina, named a World Heritage Site in 2000. ",
                    "The Manzana Jesuítica contains the University of Córdoba, one of the oldest in South America, the Monserrat Secondary School, a church, and residence buildings. To maintain such a project, the Jesuits operated six Estancias (residences) around the province of Córdoba, named Caroya, Jesús María, Santa Catalina, Alta Gracia, Candelaria, and San Ignacio. ",
                    "The farm and the complex, started in 1615, had to be left by the Jesuits, following the 1767 decree by King Charles III of Spain that expelled them from the continent. They were then run by the Franciscans until 1853, when the Jesuits returned to The Americas. Nevertheless, the university and the high-school were nationalized a year later. ",
                    "Each Estancia has its own church and set of  buildings, around which towns grew, such as Alta Gracia, the closest to the Block. The Jesuit Block and the Estancias can be visited by tourists; the Road of the Jesuit Estancias is approximately 250 kilometres (160 mi) in length. ",
                    "Jorge Mario Bergoglio, who would later become Pope Francis, lived there. "
                ]
            },
            "es": {
                "title": "Estancias jesuíticas",
                "paragraphs": [
                    "Las Estancias Jesuíticas fueron antiguos establecimientos agropecuarios diseñados y administrados por los Padres de dicha orden, ubicados en la actual provincia de Córdoba, Argentina. Los conjuntos arquitectónicos de cada establecimiento, sumados a la Manzana Jesuítica de la ciudad de Córdoba, que fuera la sede religioso-administrativa de la Provincia Jesuítica del Paraguay, fueron declarados Patrimonio de la Humanidad por Unesco en el año 2000. ",
                    "Los jesuitas abrieron seis estancias en la provincia de Córdoba, llamadas Caroya, Jesús María, Santa Catalina, Alta Gracia, La Candelaria y San Ignacio. ",
                    "Las granjas y el complejo, comenzados en 1615, fueron abandonadas por los jesuitas tras la Pragmática Sanción de 1767 del rey Carlos III de España que los expulsó del continente. Las administraron los franciscanos hasta el año 1853, cuando los jesuitas regresaron al continente americano. No obstante, la universidad y la escuela secundaria fueron nacionalizadas un año después. ",
                    "Cada estancia tiene su propia iglesia y conjunto de edificios, alrededor de los cuales crecieron las ciudades como Alta Gracia, la más cercana a la Manzana Jesuítica. Los turistas pueden visitar la Manzana Jesuítica y las Estancias; el Camino de las Estancias Jesuíticas tiene alrededor de 250 kilómetros de largo. ",
                    "La Estancia de San Ignacio ya no existe puesto que está literalmente reducida a escombros, razón por la cual no integra el área protegida como Patrimonio de la Humanidad por Unesco. "
                ]
            }
        }
    ],
    "events": [
        {
            "en": {
                "title": "2016 Summer Olympics",
                "paragraphs": [
                    "The 2016 Summer Olympics (Portuguese: Jogos Olímpicos de Verão de 2016), officially known as the Games of the XXXI Olympiad and commonly known as Rio 2016, was an international multi-sport event that was held from 5 to 21 August 2016 in Rio de Janeiro, Brazil, with preliminary events in some sports beginning on 3 August. These were the first Olympic Games ever to be held in South America and the second to be held in a developing country, after the 1968 games in Mexico City. ",
                    "More than 11,000 athletes from 205 National Olympic Committees, including first time entrants Kosovo, South Sudan, and the Refugee Olympic Team, took part. With 306 sets of medals, the games featured 28 Olympic sports, including rugby sevens and golf, which were added to the Olympic program in 2009. These sporting events took place at 33 venues in the host city, and at five separate venues in the Brazilian cities of São Paulo, Belo Horizonte, Salvador, Brasília, and Manaus. ",
                    "These were the first Summer Olympic Games to take place under the International Olympic Committee (IOC) presidency of Thomas Bach. The host city Rio de Janeiro was announced at the 121st IOC Session in Copenhagen, Denmark, on 2 October 2009. Rio became the first South American city ever to host the Olympic Games. These were the first games to be held in a Portuguese-speaking country, the first summer edition to be held entirely in the host country's winter season, the first since 1968 to be held in Latin America, and the first since 2000 to be held in the Southern Hemisphere. ",
                    "The lead-up to these Games was marked by controversies, including the Brazil's political and economic crisis; the Zika virus epidemic and the significant pollution in the Guanabara Bay; and a doping scandal involving Russia, which affected the participation of its athletes in the Games. However, nobody competing in or attending the Olympics contracted the Zika virus and the Games took place normally, without any major incident. ",
                    "The United States topped the medal table, winning the most gold and overall medals, 46 and 121, as well as its 1,000th Summer Olympic gold medal overall. Great Britain finished second and became the second country of modern Olympics history to increase its tally of medals in the subsequent games after being the host nation. China finished third. Host country Brazil won seven gold medals, its most at any single Summer Olympics, finishing in thirteenth place. Bahrain, Fiji, Jordan, Kosovo, Puerto Rico, Singapore, Tajikistan, Ivory Coast and Vietnam each won their first gold medals, as did the group of Independent Olympic Athletes (from Kuwait). "
                ]
            },
            "es": {
                "title": "Juegos Olímpicos de Río de Janeiro 2016",
                "paragraphs": [
                    "Los Juegos Olímpicos de Río de Janeiro 2016,​ oficialmente conocidos como los Juegos de la XXXI Olimpiada, o más comúnmente como Río 2016, fue un evento multideportivo internacional, celebrado en la ciudad de Río de Janeiro, Brasil, entre el 5 y el 21 de agosto de 2016, aunque la fase de grupos del torneo de fútbol comenzó el 3 de agosto en la rama femenina y el 4 de agosto en la rama masculina. También se realizaron en dicha ciudad los XV Juegos Paralímpicos, entre el 7 y el 18 de septiembre del mismo año. ",
                    "En esta edición de los Juegos Olímpicos participaron 11 551 atletas de 206 comités olímpicos nacionales —Kosovo y Sudán del Sur participaron por primera vez—, que compitieron en 306 eventos de 28 deportes,​ incluyendo el rugby 7 y el golf, agregados al programa olímpico en 2009. Las competiciones se llevaron a cabo en 33 recintos deportivos de cuatro barrios de Río de Janeiro —Maracaná, Barra da Tijuca, Deodoro y Copacabana— y en cinco estadios ubicados en las ciudades de São Paulo, Belo Horizonte, Salvador de Bahía, Brasilia y Manaos.​",
                    "La elección de Río marcó la primera vez en que dicho país ha sido designado como sede de los Juegos Olímpicos. Además, es la primera vez que se realiza un evento olímpico en un país lusófono, la primera vez que se realiza en un país sudamericano, la segunda en un país de Latinoamérica —la primera edición fue México 1968—, la tercera vez que ocurren en el hemisferio sur —previamente fueron Melbourne 1956 y Sídney 2000— y la séptima en un país del continente americano —previamente fueron San Luis 1904, Los Ángeles 1932, México 1968, Montreal 1976, Los Ángeles 1984 y Atlanta 1996—. A todo ello se incluye el dato de ser el cuarto país que organiza de forma consecutiva la Copa Mundial de Fútbol y los Juegos Olímpicos (México en 1968 y 1970; Alemania en 1972 y 1974; y Estados Unidos en 1994 y 1996). ",
                    "La organización del evento estuvo envuelta en diversas controversias, como la inestabilidad política del país, la presencia del virus del Zika y los significativos niveles de contaminación en la bahía de Guanabara. Además, un escándalo de dopaje impidió la participación de 118 atletas rusos en los Juegos.​",
                    "Siete ciudades presentaron oficialmente ante el Comité Olímpico Internacional su aspiración de albergar este evento deportivo, pero tras una primera etapa de evaluación, la lista fue reducida a cuatro ciudades: Chicago, Río de Janeiro, Madrid y Tokio. De estas, la ciudad brasileña fue elegida en la cxxi Sesión del COI, el 2 de octubre de 2009, celebrada en Copenhague. "
                ]
            }
        },
        {
            "en": {
                "title": "December 2001 Riots in Argentina",
                "paragraphs": [
                    "The December 2001 crisis, sometimes known as the <lang xml:lang='es-ES'>Argentinazo</lang>, was a period of civil unrest and rioting in Argentina, which took place during December 2001, with the most violent incidents taking place on 19 and 20 December in the capital, Buenos Aires, Rosario and other large cities around the country. It was preceded by a popular revolt against the Argentine government, rallying behind the motto \"All of them must go!\" (Spanish: <lang xml:lang='es-ES'>¡Que se vayan todos!</lang>), which caused the resignation of then-president Fernando de la Rúa, giving way to a period of political instability during which five government officials performed the duties of the Argentinian presidency. This period of instability occurred during the larger period of crisis known as the Argentine great depression, an economic, political, and social crisis that lasted from 1998 until 2002. ",
                    "The December 2001 crisis was a direct response to the government's imposition of \"Corral\" policies (Spanish: <lang xml:lang=es-ES>Corralito</lang>) at  the behest of economic minister Domingo Cavallo, which restricted people's ability to withdraw cash from banks. Rioting and protests became widespread on 19 December 2001, immediately following the president's declaration of a state of emergency and his resignation on the following day. A state of extreme institutional instability continued for the next twelve days, during which the successor president Adolfo Rodríguez Saá resigned as well. While the degree of instability subsided, the events of December 2001 would become a blow against the legitimacy of the Argentine government that would persist for the following years. ",
                    "The majority of the participants in the protests were unaffiliated with any political party or organization. Over the course of the protests, 39 people were killed by police and security forces. Of the 39 killed, nine were minors, which is an indication of the degree of repression ordered by the government to oppose the protests. "
                ]
            },
            "es": {
                "title": "Crisis de diciembre de 2001 en Argentina",
                "paragraphs": [
                    "La crisis de diciembre de 2001 en Argentina, o crisis de 2001, también referida como el Cacerolazo o el Argentinazo, fue una crisis política, económica, social e institucional, potenciada por una revuelta popular generalizada bajo el lema \"¡Que se vayan todos!\", que causó la renuncia del entonces presidente de Argentina Fernando de la Rúa, dando lugar a un período de inestabilidad política durante el cual cinco funcionarios ejercieron la Presidencia de la Nación. Sucedió en el marco de una crisis mayor que se extendió entre 1998 y 2002, causada por una larga recesión que disparó una crisis humanitaria, de representatividad, social, económica, financiera y política. ",
                    "El desencadenante inmediato de la crisis fue la imposición del \"Corralito\", una disposición del Gobierno que restringía la extracción de dinero en efectivo de los bancos, diseñada por el entonces ministro de Economía Domingo Cavallo. La revuelta se generalizó el 19 de diciembre de 2001, inmediatamente después de que el presidente radical Fernando de la Rúa anunciara el establecimiento del estado de sitio, causando su renuncia al día siguiente. Durante los siguientes doce días se produjo una alta inestabilidad institucional que llevó también a la renuncia del presidente sucesor Adolfo Rodríguez Saa. El clima de inestabilidad social y económica, así como el desconocimiento generalizado de legitimidad a los representantes políticos, se extendería en los años siguientes. ",
                    "La mayor parte de las personas que participaron en las protestas fueron autoconvocadas y no respondían a ningún partido político, sindicato u organización social estructurada. Durante el transcurso de las protestas, 39 personas fueron asesinadas por las fuerzas policiales y de seguridad, entre ellos 9 menores de edad, en el marco de la represión ordenada por el gobierno para contener las manifestaciones tras la instauración del estado de sitio. "
                ]
            }
        },
        {
            "en": {
                "title": "Reconquista",
                "paragraphs": [
                    "The Reconquista (Spanish and Portuguese for \"reconquest\") is a name used in English to describe the period in the history of the Iberian Peninsula of about 780 years between the Umayyad conquest of Hispania in 711 and the fall of the Nasrid kingdom of Granada to the expanding Christian kingdoms in 1492. The completed conquest of Granada was the context of the Spanish voyages of discovery and conquest (Columbus got royal support in Granada in 1492, months after its conquest), and the Americas—the \"New World\"—ushered in the era of the Spanish and Portuguese colonial empires. ",
                    "Traditional historiography has marked the beginning of the Reconquista with the Battle of Covadonga (718 or 722), the first known victory in Iberia by Christian military forces since the 711 military invasion of Iberia by combined Arab-Berber forces. In that small battle, a group led by the nobleman Pelagius defeated a Muslim patrol in the mountains of northern Iberia and established the independent Christian Kingdom of Asturias. In the late 10th century, the Umayyad vizier Almanzor waged military campaigns for 30 years to subjugate the northern Christian kingdoms. His armies, mostly composed of Slavic and African Mamluks (slave soldiers), ravaged the north, even sacking the great shrine of Santiago de Compostela. When the government of Córdoba disintegrated in the early 11th century, a series of petty successor states known as taifas emerged. The northern kingdoms took advantage of this situation and struck deep into Al-Andalus; they fostered civil war, intimidated the weakened taifas, and made them pay large tributes (parias) for protection. After a Muslim resurgence in the 12th century the great Moorish strongholds in the south fell to Christian forces in the 13th century—Córdoba in 1236 and Seville in 1248—leaving only the Muslim enclave of Granada as a tributary state in the south. ",
                    "After 1491, the entire peninsula was controlled by Christian rulers. The conquest was followed by the Alhambra Decree (1492) which expelled Jews who would not convert to Christianity from Castile and Aragon, and a series of edicts (1499–1526) which forced the conversions of the Muslims in Spain, although later a significant part of them was expelled from the Iberian Peninsula. ",
                    "The concept of Reconquista, consolidated in Spanish historiography in the second half of the 19th century, was associated with the development of a Spanish national identity, emphasizing nationalistic and romantic, and occasionally, colonialist, aspects. "
                ]
            },
            "es": {
                "title": "Reconquista",
                "paragraphs": [
                    "Se denomina Reconquista al período en la historia de la península ibérica de aproximadamente 780 años entre la conquista omeya de Hispania en 711 y la caída del Reino nazarí de Granada ante los reinos cristianos en expansión en 1491. La conquista completa de Granada fue el contexto de los viajes españoles de descubrimiento y conquista de América, el \"Nuevo Mundo\", que iniciaron la era de los imperios español y portugués. Colón obtuvo el apoyo real en Granada en 1492, meses después de su conquista. ",
                    "La historiografía tradicional ha marcado el comienzo de la Reconquista con la batalla de Covadonga (718 o 722), la primera victoria conocida de las fuerzas militares cristianas en Iberia desde la intervención militar de las fuerzas combinadas árabe-bereber de 711. En esa pequeña batalla, un grupo liderado por el noble Pelayo derrotó a una patrulla musulmana en las montañas del norte de Iberia y estableció el reino cristiano independiente de Asturias. La Reconquista terminó con la conquista del emirato de Granada, el último estado musulmán en la península, en 1491. ",
                    "Después de 1491, toda la península fue controlada por gobernantes cristianos. La Reconquista fue seguida por el Edicto de Granada (1492) que expulsó a los judíos que no se convertirían al cristianismo de Castilla y Aragón, y una serie de edictos (1499-1526) que forzaron las conversiones de los musulmanes en España. Desde mediados del siglo XIX, la idea de una \"reconquista\" se arraigó en España asociada a su creciente nacionalismo y colonialismo.​",
                    "El término Reconquista ha sido muy discutido e incluso su uso ha sido cuestionado por no responder a la realidad histórica medieval peninsular.​"
                ]
            }
        }
    ],
    "nature": [
        {
            "en": {
                "title": "Blue Whale",
                "paragraphs": [
                    "The blue whale (Balaenoptera musculus) is a marine mammal belonging to the baleen whale parvorder, Mysticeti. At up to 29.9 metres (98 ft) in length and with a maximum recorded weight of 173 tonnes (190 short tons), it is the largest animal known to have ever existed. ",
                    "Long and slender, the blue whale's body can be various shades of bluish-grey dorsally and somewhat lighter underneath. There are at least three distinct subspecies: B. m. musculus of the North Atlantic and North Pacific, B. m. intermedia of the Southern Ocean and B. m. brevicauda (also known as the pygmy blue whale) found in the Indian Ocean and South Pacific Ocean. B. m. indica, found in the Indian Ocean, may be another subspecies. As with other baleen whales, its diet consists almost exclusively of small crustaceans known as krill. ",
                    "Blue whales were abundant in nearly all the oceans on Earth until the beginning of the twentieth century. For over a century, they were hunted almost to extinction by whalers until protected by the international community in 1966. A 2002 report estimated there were 5,000 to 12,000 blue whales worldwide, in at least five populations. The IUCN estimates that there are probably between 10,000 and 25,000 blue whales worldwide today. Before whaling, the largest population was in the Antarctic, numbering approximately 239,000 (range 202,000 to 311,000). There remain only much smaller (around 2,000) concentrations in each of the eastern North Pacific, Antarctic, and Indian Ocean populations. There are two more groups in the North Atlantic, and at least two in the Southern Hemisphere. The Eastern North Pacific blue whale population had rebounded by 2014 to nearly its pre-hunting population. "
                ]
            },
            "es": {
                "title": "Balaenoptera musculus",
                "paragraphs": [
                    "La ballena azul (Balaenoptera musculus), también conocida como rorcual azul, es una especie de cetáceo misticeto de la familia Balaenopteridae. Su tamaño medio es de entre 24 y 27 m de longitud y pesan entre 100 y 120 t,​ aunque hay registros de ejemplares de más de 30 m de longitud y 170 t de peso,​ que lo convierten en el mayor animal del planeta Tierra, no solo en la actualidad sino también el mayor del que se tenga noticia en la historia. ",
                    "Largo y estilizado, el cuerpo de este mamífero marino es de color gris azulado a lo largo del dorso y algo más claro en la zona ventral. Existen al menos tres subespecies distintas: B. m. musculus, del Atlántico norte y Pacífico norte; B. m. intermedia, del océano Antártico y B. m. brevicauda (también conocida como ballena azul pigmea), que se encuentra en el Índico y en el Pacífico sur. Existen dudas sobre la validez de una cuarta subespecie, B. m. indica, que también se encuentra en el océano Índico. Como otras ballenas barbadas, su dieta consiste principalmente en pequeños crustáceos conocidos como kril. ",
                    "Las ballenas azules eran abundantes en casi todos los océanos hasta comienzos del siglo XX. Durante más de cuarenta años fueron cazadas hasta casi su extinción, lo que incentivó su protección por parte de la comunidad internacional en 1966.​Un informe de 2002 estimó su número entre 5000 y 12 000 ejemplares en todo el mundo, localizados en al menos cinco grupos, aunque una investigación más reciente sobre la subespecie pigmea sugiere que estos datos pueden ser una subestimación.​ Antes del comienzo de la caza comercial de ballenas, la población más numerosa era la de la Antártida, con alrededor de 239 000 ejemplares (entre 202 000 y 311 000). Actualmente solo quedan concentraciones mucho menores (de alrededor de 2000 individuos) en los océanos Pacífico nororiental, Antártico e Índico. Hay dos grupos más en el Atlántico norte y por lo menos dos en el hemisferio sur. "
                ]
            }
        },
        {
            "en": {
                "title": "Andean Condor",
                "paragraphs": [
                    "The Andean condor (Vultur gryphus) is a South American bird in the New World vulture family Cathartidae and is the only member of the genus Vultur. Found in the Andes mountains and adjacent Pacific coasts of western South America, the Andean condor is the largest flying bird in the world by combined measurement of weight and wingspan. It has a maximum wingspan of 3.3 m (10 ft 10 in) exceeded only by the wingspans of four seabirds and water birds—the roughly 3.5 m (11 ft 6 in) maximum of the wandering albatross, southern royal albatross, great white pelican and Dalmatian pelican. ",
                    "It is a large black vulture with a ruff of white feathers surrounding the base of the neck and, especially in the male, large white patches on the wings. The head and neck are nearly featherless, and are a dull red color, which may flush and therefore change color in response to the bird's emotional state. In the male, there is a wattle on the neck and a large, dark red comb or caruncle on the crown of the head. Unlike most birds of prey, the male is larger than the female. ",
                    "The condor is primarily a scavenger, feeding on carrion. It prefers large carcasses, such as those of deer or cattle. It reaches sexual maturity at five or six years of age and nests at elevations of up to 5,000 m (16,000 ft), generally on inaccessible rock ledges. One or two eggs are usually laid. It is one of the world's longest-living birds, with a lifespan of over 70 years in some cases. ",
                    "The Andean condor is a national symbol of Argentina, Bolivia, Chile, Colombia, Ecuador, and Peru and plays an important role in the folklore and mythology of the Andean regions. The Andean condor is considered near threatened by the IUCN. It is threatened by habitat loss and by secondary poisoning from carcasses killed by hunters. Captive breeding programs have been instituted in several countries. "
                ]
            },
            "es": {
                "title": "Vultur Gryphus",
                "paragraphs": [
                    "El cóndor andino, cóndor de los Andes o simplemente cóndor (Vultur gryphus)​ es una especie de ave de la familia Cathartidae que habita en Sudamérica. El orden al que pertenece su familia se encuentra en disputa. Se extiende por la cordillera de los Andes, cordilleras próximas a ella y las costas adyacentes de los océanos Pacífico y Atlántico. Es el ave no marina de mayor envergadura del planeta,​ no posee subespecies​ y su nombre procede del quechua kuntur. ",
                    "Es un ave grande y negra, con plumas blancas alrededor del cuello y en partes de las alas. La cabeza carece de plumas y es de color rojo, pudiendo cambiar de tonalidad de acuerdo con el estado emocional del ave. A diferencia de la mayor parte de las aves de presa, el macho es mayor que la hembra. Los machos presentan el aparato reproductor de mayor envergadura del planeta. ",
                    "Es un ave carroñera. Alcanza la madurez sexual a los 5 o 6 años de edad  y anida entre los 1000 y 5000 msnm, generalmente en formaciones rocosas inaccesibles. Posee una tasa de reproducción muy baja; se espera que al menos ponga un huevo cada dos años. Es una de las aves más longevas, pudiendo alcanzar la edad de 75 años en cautiverio. ",
                    "Es un símbolo nacional de Argentina, Bolivia, Chile —presente en toda su extensión y donde está su mayor área de distribución—,​ Colombia, Ecuador, Perú y Venezuela, teniendo un importante rol en el folclore y la mitología de las regiones andinas de Sudamérica. Fue declarado monumento natural de Chile mediante decreto el 30 de junio de 2006.​ La provincia de Mendoza en Argentina lo declaró monumento natural provincial mediante la ley n.º 6599 sancionada el 12 de mayo de 1998,​ lo mismo que la provincia de Santa Cruz mediante la ley n.º 2916 sancionada el 24 de agosto de 2006,​ mientras que la provincia de Tierra del Fuego lo declaró patrimonio natural mediante la ley n.º 558 sancionada el 19 de septiembre de 2002.​La Unión Internacional para la Conservación de la Naturaleza la cataloga como una especie casi amenazada, ya que sufre la pérdida de su hábitat y el envenenamiento por la ingesta de animales intoxicados o de los propios cebos envenenados colocados ilegalmente por cazadores y ganaderos. Varios países iniciaron programas de reproducción en cautividad. "
                ]
            }
        },
        {
            "en": {
                "title": "Cougar",
                "paragraphs": [
                    "The cougar (Puma concolor), also commonly known by other names including catamount, mountain lion, panther, and puma, is a large felid of the subfamily Felinae native to the Americas.  Its range, from the Canadian Yukon to the southern Andes of South America, is the widest of any large wild terrestrial mammal in the Western Hemisphere. An adaptable, generalist species, the cougar is found in most American habitat types. It is the biggest cat in North America, and the second-heaviest cat in the New World after the jaguar. Secretive and largely solitary by nature, the cougar is properly considered both nocturnal and crepuscular, although daytime sightings do occur. The cougar is more closely related to smaller felines, including the domestic cat (subfamily Felinae), than to any species of subfamily Pantherinae, of which only the jaguar is native to the Americas. ",
                    "The cougar is an ambush predator that pursues a wide variety of prey. Primary food sources are ungulates, particularly deer. It also hunts species as small as insects and rodents. This cat prefers habitats with dense underbrush and rocky areas for stalking, but can also live in open areas. The cougar is territorial and survives at low population densities. Individual territory sizes depend on terrain, vegetation, and abundance of prey. While large, it is not always the apex predator in its range, yielding prey it has killed to lone jaguars, American black bears, and grizzly bears, and to groups of gray wolves. It is reclusive and mostly avoids people. Fatal attacks on humans are rare, but have recently been increasing in North America as more people enter cougar territories. ",
                    "Intensive hunting following European colonization of the Americas and the ongoing human development of cougar habitat has caused populations to drop in most parts of its historical range. In particular, the North American cougar was extirpated in eastern North America in the beginning of the 20th century, except for the isolated Florida panther subpopulation. Transient males have been verified in Minnesota, Missouri, Iowa, Michigan, Indiana, and Illinois (where a cougar was shot in the city limits of Chicago), and in at least one instance, observed as far east as coastal Connecticut. Reports of eastern cougars (P. c. cougar) still surface, although it was declared extirpated in 2011. "
                ]
            },
            "es": {
                "title": "Puma concolor",
                "paragraphs": [
                    "El puma, león de montaña, león americano (Puma concolor) es un mamífero carnívoro de la familia Felidae nativo de América. Este gran felino vive en más lugares que cualquier otro mamífero salvaje terrestre del continente, ya que se extiende desde el Yukón, en Canadá, hasta el sur de la cordillera de los Andes y la Patagonia, Argentina y Chile en América del Sur. El puma es adaptable y generalista, por lo que se encuentra en los principales biomas de toda América. Es el segundo mayor félido en el continente americano, después del jaguar, y el quinto más grande del mundo, junto con el leopardo después del tigre, el león y el jaguar. Su tamaño es algo mayor que el del irbis o \"leopardo de las nieves\", aunque está más emparentado con los pequeños felinos, ya que, a diferencia de los grandes félidos del género Panthera, que pueden rugir, el puma ronronea como los felinos menores. ",
                    "Como caza y depredador de emboscada, el puma persigue una amplia variedad de presas. Su principal alimento son los ungulados como el ciervo, en particular en la parte septentrional de su área de distribución, pero también caza camélidos como el guanaco y especies tan pequeñas como insectos y roedor. Prefiere hábitat con vegetación densa durante las horas de acecho, pero puede vivir en zonas abiertas. El puma es territorial y tiene una baja densidad de población. La extensión de su territorio depende de la vegetación y de la abundancia de presas. Aunque es un gran depredador, no siempre es la especie dominante en su área de distribución, como cuando compite con otros depredadores como el jaguar. Se trata de un felino solitario que por lo general evita a las personas. Los ataques a seres humanos son raros, aunque su frecuencia ha aumentado en los últimos años. ", 
                    "El puma fue considerado una fiera peligrosa a partir de la colonización europea de América. Esta consideración y la progresiva ocupación humana de los hábitats del puma han hecho que sus poblaciones disminuyan en casi todos sus hábitats históricos. En particular, el puma fue extinguido en la parte oriental de América del Norte, con excepción del caso aislado de una subpoblación en la Florida. Se cree que este felino podría recolonizar parte de su antiguo territorio oriental. Con su amplia distribución geográfica, el puma tiene decenas de nombres y es mencionado con diversas referencias en la mitología de los pueblos aborígenes de América y también en la cultura contemporánea. "
                ]
            }
        }
    ]
}

const welcomeOutput = "<lang xml:lang='es-ES'>Hola!</lang> Welcome to Wiki Learn Spanish! \
I can read articles in Spanish and in English to help you improve your language skills. \
I will read them to you either paragraph by paragraph, or each full article at a time. \
Say 'Plan my lesson' to begin.";
const welcomeReprompt = "Say 'plan my lesson' to begin.";
const helpOutput ="'You can say 'plan my lesson' to choose an article category and reading style.";
const helpReprompt = "Try saying 'plan my lesson'.";

// 1. Intent Handlers =============================================

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'LaunchRequest';
  },
  handle(handlerInput) {
    const responseBuilder = handlerInput.responseBuilder;
    return responseBuilder
      .speak(welcomeOutput)
      .reprompt(welcomeReprompt)
      .getResponse();
  },
};

const InProgressPlanMyLessonHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest' &&
      request.intent.name === 'PlanMyLessonIntent' &&
      request.dialogState !== 'COMPLETED';
  },
  handle(handlerInput) {
    const currentIntent = handlerInput.requestEnvelope.request.intent;
    return handlerInput.responseBuilder
      .addDelegateDirective(currentIntent)
      .getResponse();
  },
};

const CompletedPlanMyLessonHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    // console.log('request is ', request);
    return request.type === 'IntentRequest' &&
        request.intent.name === 'PlanMyLesson' &&
        request.dialogState === 'COMPLETED';
  },
  async handle(handlerInput) {
      
    const attributesManager = handlerInput.attributesManager;
    // get current saved attributes
    let s3Attributes = await attributesManager.getPersistentAttributes() || {};
    // if attribute exists, get its value; otherwise, assign 0
    const peopleCounter = s3Attributes.hasOwnProperty('peopleCounter')? (s3Attributes.peopleCounter) : 0;
    const placesCounter = s3Attributes.hasOwnProperty('placesCounter')? (s3Attributes.placesCounter) : 0;
    const eventsCounter = s3Attributes.hasOwnProperty('eventsCounter')? (s3Attributes.eventsCounter) : 0;
    const natureCounter = s3Attributes.hasOwnProperty('natureCounter')? (s3Attributes.natureCounter) : 0;
    s3Attributes = {
        "peopleCounter": peopleCounter,
        "placesCounter": placesCounter,
        "eventsCounter": eventsCounter,
        "natureCounter": natureCounter
    };

    const responseBuilder = handlerInput.responseBuilder;
    const filledSlots = handlerInput.requestEnvelope.request.intent.slots;
    const slotValues = getSlotValues(filledSlots);
    // console.log('slotValues is ', slotValues);
    preferredReadingStyle = slotValues.readingStyle.resolved;
    // console.log('preferredReadingStyle is ', preferredReadingStyle);
    preferredCategory = slotValues.category.resolved;
    
    let speechOutput = `Here is a Spanish article about ${preferredCategory}. `;
    
    if (preferredCategory === 'people') {
        console.log('index of people article is ', peopleCounter);
        let article = articleData.people[peopleCounter%(articleData.people.length)];
        let spanishArticleTitle = article.es.title;
        let spanishParagraphs = article.es.paragraphs;
        let englishArticleTitle = article.en.title;
        let englishParagraphs = article.en.paragraphs;
        
        if (preferredReadingStyle === 'full article') {
            speechOutput += `<voice name='Conchita'><lang xml:lang='es-ES'>El título del artículo es ${spanishArticleTitle}. </lang></voice>`;
            for (let i = 0; i < spanishParagraphs.length; i++) {
                speechOutput += spanishSpeak(spanishParagraphs[i]);
            }
            speechOutput += `The title of the article is ${englishArticleTitle}. `
            for (let i = 0; i < englishParagraphs.length; i++) {
                speechOutput += englishSpeak(englishParagraphs[i]);
            }
        } else if (preferredReadingStyle === 'alternating paragraphs') {
            for (let i = 0; i < spanishParagraphs.length; i++) {
                if (i === 0) {
                    speechOutput += `<voice name='Conchita'><lang xml:lang='es-ES'>El título del artículo es ${spanishArticleTitle}. </lang></voice>`;
                } else {
                    // speechOutput += `<voice name='Conchita'><lang xml:lang='es-ES'>Back to Spanish. </lang></voice>`;
                }
                speechOutput += spanishSpeak(spanishParagraphs[i]) + "<break time='1s' />"; // add break between switching langs
                if (i === 0) {
                    speechOutput += `The title of the article is ${englishArticleTitle}. `
                }
                speechOutput += englishSpeak(englishParagraphs[i]) + "<break time='1s' />"; // add break between switching langs
            }
        }
        s3Attributes.peopleCounter++;
    }
    
    if (preferredCategory === 'places') {
        console.log('index of places article is ', placesCounter);
        let article = articleData.places[placesCounter%(articleData.places.length)];
        let spanishArticleTitle = article.es.title;
        let spanishParagraphs = article.es.paragraphs;
        let englishArticleTitle = article.en.title;
        let englishParagraphs = article.en.paragraphs;
        
        if (preferredReadingStyle === 'full article') {
            speechOutput += `<voice name='Conchita'><lang xml:lang='es-ES'>El título del artículo es ${spanishArticleTitle}. </lang></voice>`;
            for (let i = 0; i < spanishParagraphs.length; i++) {
                speechOutput += spanishSpeak(spanishParagraphs[i]);
            }
            speechOutput += `The title of the article is ${englishArticleTitle}. `
            for (let i = 0; i < englishParagraphs.length; i++) {
                speechOutput += englishSpeak(englishParagraphs[i]);
            }
        } else if (preferredReadingStyle === 'alternating paragraphs') {
            for (let i = 0; i < spanishParagraphs.length; i++) {
                if (i === 0) {
                    speechOutput += `<voice name='Conchita'><lang xml:lang='es-ES'>El título del artículo es ${spanishArticleTitle}. </lang></voice>`;
                } else {
                    // speechOutput += `<voice name='Conchita'><lang xml:lang='es-ES'>Back to Spanish. </lang></voice>`;
                }
                speechOutput += spanishSpeak(spanishParagraphs[i]) + "<break time='1s' />"; // add break between switching langs
                if (i === 0) {
                    speechOutput += `The title of the article is ${englishArticleTitle}. `
                }
                speechOutput += englishSpeak(englishParagraphs[i]) + "<break time='1s' />"; // add break between switching langs
            }
        }
        s3Attributes.placesCounter++;
    }
    
    if (preferredCategory === 'events') {
        console.log('index of events article is ', eventsCounter);
        let article = articleData.events[eventsCounter%(articleData.events.length)];
        let spanishArticleTitle = article.es.title;
        let spanishParagraphs = article.es.paragraphs;
        let englishArticleTitle = article.en.title;
        let englishParagraphs = article.en.paragraphs;
        
        if (preferredReadingStyle === 'full article') {
            speechOutput += `<voice name='Conchita'><lang xml:lang='es-ES'>El título del artículo es ${spanishArticleTitle}. </lang></voice>`;
            for (let i = 0; i < spanishParagraphs.length; i++) {
                speechOutput += spanishSpeak(spanishParagraphs[i]);
            }
            speechOutput += `The title of the article is ${englishArticleTitle}. `
            for (let i = 0; i < englishParagraphs.length; i++) {
                speechOutput += englishSpeak(englishParagraphs[i]);
            }
        } else if (preferredReadingStyle === 'alternating paragraphs') {
            for (let i = 0; i < spanishParagraphs.length; i++) {
                if (i === 0) {
                    speechOutput += `<voice name='Conchita'><lang xml:lang='es-ES'>El título del artículo es ${spanishArticleTitle}. </lang></voice>`;
                } else {
                    // speechOutput += `<voice name='Conchita'><lang xml:lang='es-ES'>Back to Spanish. </lang></voice>`;
                }
                speechOutput += spanishSpeak(spanishParagraphs[i]) + "<break time='1s' />"; // add break between switching langs
                if (i === 0) {
                    speechOutput += `The title of the article is ${englishArticleTitle}. `
                }
                speechOutput += englishSpeak(englishParagraphs[i]) + "<break time='1s' />"; // add break between switching langs
            }
        }
        s3Attributes.eventsCounter++;
    }
    
    if (preferredCategory === 'nature') {
        // let natureCount = natureCounter;
        console.log('index of nature article is ', natureCounter);
        let article = articleData.nature[natureCounter%(articleData.nature.length)];
        let spanishArticleTitle = article.es.title;
        let spanishParagraphs = article.es.paragraphs;
        let englishArticleTitle = article.en.title;
        let englishParagraphs = article.en.paragraphs;
        
        if (preferredReadingStyle === 'full article') {
            speechOutput += `<voice name='Conchita'><lang xml:lang='es-ES'>El título del artículo es ${spanishArticleTitle}. </lang></voice>`;
            for (let i = 0; i < spanishParagraphs.length; i++) {
                speechOutput += spanishSpeak(spanishParagraphs[i]);
            }
            speechOutput += `The title of the article is ${englishArticleTitle}. `
            for (let i = 0; i < englishParagraphs.length; i++) {
                speechOutput += englishSpeak(englishParagraphs[i]);
            }
        } else if (preferredReadingStyle === 'alternating paragraphs') {
            for (let i = 0; i < spanishParagraphs.length; i++) {
                if (i === 0) {
                    speechOutput += `<voice name='Conchita'><lang xml:lang='es-ES'>El título del artículo es ${spanishArticleTitle}. </lang></voice>`;
                } else {
                    // speechOutput += `<voice name='Conchita'><lang xml:lang='es-ES'>Back to Spanish. </lang></voice>`;
                }
                speechOutput += spanishSpeak(spanishParagraphs[i]) + "<break time='1s' />"; // add break between switching langs
                if (i === 0) {
                    speechOutput += `The title of the article is ${englishArticleTitle}. `
                }
                speechOutput += englishSpeak(englishParagraphs[i]) + "<break time='1s' />"; // add break between switching langs
            }
        }
        s3Attributes.natureCounter++;
    }
    
    speechOutput += "<break time='2s' /> Say 'Plan my lesson' for another lesson, or 'Quit' to exit.";
    
    attributesManager.setPersistentAttributes(s3Attributes);
    await attributesManager.savePersistentAttributes();
    
    // const attributesManager = handlerInput.attributesManager;
    
    console.log('s3Attributes is: ', s3Attributes);
    console.log('speechOutput: ', speechOutput);

    return responseBuilder
      .speak(speechOutput)
      .getResponse();
  },
};

const ResetLessonCounterHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    // console.log('request is ', request);
    return request.type === 'IntentRequest' &&
        request.intent.name === 'ResetLessonCounters'
  },
  async handle(handlerInput) {
      
    const responseBuilder = handlerInput.responseBuilder;
      
    const attributesManager = handlerInput.attributesManager;
    // get current saved attributes
    let s3Attributes = await attributesManager.getPersistentAttributes() || {};
    console.log('current s3Attributes: ', s3Attributes);
    s3Attributes = {
        "peopleCounter": 0,
        "placesCounter": 0,
        "eventsCounter": 0,
        "natureCounter": 0
    };
    
    attributesManager.setPersistentAttributes(s3Attributes);
    await attributesManager.savePersistentAttributes();
    s3Attributes = await attributesManager.getPersistentAttributes() || {};
    console.log('reset s3Attributes: ', s3Attributes);
    
    return responseBuilder
      .speak('Lesson counters have been reset.')
      .getResponse();
  }
};

const HelpIntentHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest' && request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    const responseBuilder = handlerInput.responseBuilder;
    return responseBuilder
      .speak(helpOutput)
      .reprompt(helpReprompt)
      .getResponse();
  },
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
                || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speechText = "<lang xml:lang='es-ES'>Nos vemos!</lang>";
        return handlerInput.responseBuilder
            .speak(speechText)
            .getResponse();
    }
};
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse();
    }
};

// The intent reflector is used for interaction model testing and debugging.
// It will simply repeat the intent the user said. You can create custom handlers
// for your intents by defining them above, then also adding them to the request
// handler chain below.
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = handlerInput.requestEnvelope.request.intent.name;
        const speechText = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speechText)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

// Generic error handling to capture any syntax or routing errors. If you receive an error
// stating the request handler chain is not found, you have not implemented a handler for
// the intent being invoked or included it in the skill builder below.
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.log(`~~~~ Error handled: ${error.message}`);
        const speechText = `Sorry, I couldn't understand what you said. Please try again.`;

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
};

// Helper functions
function setVoice(text, voice_name) {
  if (text) {
    return "<voice name='" + voice_name + "'>" + text + "</voice>";
  }
}

function setLang(text, lang) {
    if (text) {
        return "<lang xml:lang='" + lang + "'>" + text + "</lang>";
    }
}

function spanishSpeak(text) {
    if (text) {
        return "<voice name='Conchita'><lang xml:lang='es-ES'>" + text + "</lang></voice>";
    }
}

function englishSpeak(text) {
    if (text) {
        return "<voice name='Joanna'><lang xml:lang='en-US'>" + text + "</lang></voice>";
    }
}

function getSlotValues(filledSlots) {
  const slotValues = {};

  console.log(`The filled slots: ${JSON.stringify(filledSlots)}`);
  Object.keys(filledSlots).forEach((item) => {
    const name = filledSlots[item].name;

    if (filledSlots[item] &&
      filledSlots[item].resolutions &&
      filledSlots[item].resolutions.resolutionsPerAuthority[0] &&
      filledSlots[item].resolutions.resolutionsPerAuthority[0].status &&
      filledSlots[item].resolutions.resolutionsPerAuthority[0].status.code) {
      switch (filledSlots[item].resolutions.resolutionsPerAuthority[0].status.code) {
        case 'ER_SUCCESS_MATCH':
          slotValues[name] = {
            synonym: filledSlots[item].value,
            resolved: filledSlots[item].resolutions.resolutionsPerAuthority[0].values[0].value.name,
            isValidated: true,
          };
          break;
        case 'ER_SUCCESS_NO_MATCH':
          slotValues[name] = {
            synonym: filledSlots[item].value,
            resolved: filledSlots[item].value,
            isValidated: false,
          };
          break;
        default:
          break;
      }
    } else {
      slotValues[name] = {
        synonym: filledSlots[item].value,
        resolved: filledSlots[item].value,
        isValidated: false,
      };
    }
  }, this);

  return slotValues;
}

// helper to reset s3 counters 
function resetS3() {
    return {
        "peopleCounter": 0,
        "placesCounter": 0,
        "eventsCounter": 0,
        "natureCounter": 0
    };
}

// This handler acts as the entry point for your skill, routing all request and response
// payloads to the handlers above. Make sure any new handlers or interceptors you've
// defined are included below. The order matters - they're processed top to bottom.
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        InProgressPlanMyLessonHandler,
        CompletedPlanMyLessonHandler,
        ResetLessonCounterHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler
        ) // make sure IntentReflectorHandler is last so it doesn't override your custom intent handlers
    .addErrorHandlers(
        ErrorHandler
        )
    .withPersistenceAdapter(
        new persistenceAdapter.S3PersistenceAdapter({bucketName:process.env.S3_PERSISTENCE_BUCKET})
        )
    .lambda();
