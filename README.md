<h1>Aprakstīts ER diagrammas veidošanas process:</h1>
<br>
<img width="1105" height="641" alt="image" src="https://github.com/user-attachments/assets/ac8bea80-919f-4f10-bb52-4b785cb2b9a3" />
<br>
<hr>
<h1>ER diagrammas:</h1>
<br>
<img width="873" height="725" alt="image" src="https://github.com/user-attachments/assets/8f4a3b95-743d-4ba2-b061-14d7416871df" />
<br>
<hr>
<h1>Lietotnes prototips:</h1>
<br>
<img width="943" height="501" alt="loginPage" src="https://github.com/user-attachments/assets/37c25fd3-1d36-4019-b1a1-834299461ec8" />
<img width="947" height="500" alt="registracija" src="https://github.com/user-attachments/assets/7a0b8db7-0a25-4312-b7ce-870c4d37410d" />
<img width="943" height="497" alt="mainPage" src="https://github.com/user-attachments/assets/541cb686-61a2-4503-9a7a-db13baf665d6" />
<img width="956" height="500" alt="orderList" src="https://github.com/user-attachments/assets/5e72ea8b-d411-4890-97b8-3cda12332c38" />
<img width="937" height="495" alt="pasutijums" src="https://github.com/user-attachments/assets/04d8b734-f3f6-4e8e-88d1-9dbae6655d63" />
<img width="929" height="493" alt="pasutijums2" src="https://github.com/user-attachments/assets/a67e0d12-1b6f-4440-8741-8523b56bba98" />
<br>
<hr>
<h1 style="font-weight: 900">Lietotnes funkcionalitātes apraksts:</h1>
<br>
Datu apstrādes loģika apraksta datubāzes struktūru un to, kā informācija tiek glabāta, sasaistīta 
un izmantota dažādos biznesa procesos. Attēlā redzamajā E-R diagrammā iesaistītas piecas 
galvenās entītijas: Klients, Maršruts, Maršruta Analītiķis, Rēķins un šo entītiju savstarpējās 
attiecības. 
Katram klientam datubāzē tiek piešķirts unikāls identifikators — klienta_ID. Klienta dati ietver 
uzvārdu, vārdu, e-pasta adresi, kā arī sākuma un gala punktus, kas var tikt izmantoti maršruta 
definēšanai vai meklēšanai. Klientam var būt vairāki ar viņu saistīti maršruti, kurus pārrauga 
darbinieki vai maršruta analītiķi, tāpēc starp Klients un Maršruta Analītiķis pastāv relācija 
"viens pret daudziem". 
Maršruta Analītiķis apzīmē darbinieku, kurš veic klienta maršruta analīzi. Šī entītija satur 
darbinieka identifikatoru, kas vienlaikus kalpo arī kā primārā atslēga. Šajā tabulā papildus tiek 
glabāti darbinieka vārds, uzvārds, e-pasts, kā arī informācija par analizēto klientu, maršruta ID, 
sākuma un gala punktiem. Visi šie lauki veido ārējās atslēgas, kas sasaista analītiķa darbību ar 
klientu un konkrēto maršrutu. Darbinieks var būt atbildīgs par vairākiem klientiem un 
maršrutiem, tāpēc šeit dominē 1:N relācijas. 
Entītijā "Maršruts" tiek glabāta informācija par katru pieejamo vai realizēto maršrutu. Katram 
maršrutam ir unikāls ID, cena, nosaukums, ilgums (maršruta laiks) un degvielas patēriņš. 
Maršruti tiek sasaistīti gan ar rēķinu izrakstīšanu, gan analīzi, tāpēc tie ir būtiski vairāku relāciju 
mezgli. Vienam maršrutam var būt izveidots viens vai vairāki rēķini un to var analizēt vairāki 
darbinieki. 
Rēķins ir atsevišķa entītija, kas kalpo par finanšu dokumentu, sasaistot darbinieku, klientu un 
maršrutu. Katram rēķinam ir savs unikālais identifikators, kā arī ārējās atslēgas, kas norāda uz 
darbinieka ID, klienta ID un maršruta ID. Papildus tiek saglabāta informācija par rēķinu, kas var 
ietvert, piemēram, maksājumu datumu, apmaksas statusu vai aprakstu. Arī šajā tabulā tiek 
nodrošināta relācija "viens pret daudziem" — viens darbinieks var izrakstīt vairākus rēķinus 
dažādiem klientiem un maršrutiem. 
Lai nodrošinātu efektīvu datu pārvaldību, katrai entītijai tiek piešķirta primārā atslēga, kas ir 
automātiski pieaugošs veselais skaitlis. Ārējās atslēgas tiek izmantotas relāciju uzturēšanai starp 
tabulām, un tās veido indeksus, lai paātrinātu pieprasījumu izpildi. Ir vēlams pievienot unikālus 
indeksus e-pasta laukiem, jo tie kalpo kā sekundāras identifikācijas īpašības. 
Šī datu apstrādes loģika nodrošina skaidru struktūru, kas ļauj viegli analizēt, izrakstīt rēķinus un 
pārvaldīt attiecības starp klientiem, darbiniekiem un maršrutiem.
