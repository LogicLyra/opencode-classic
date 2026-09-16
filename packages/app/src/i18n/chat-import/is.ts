export const dict = {
  "profileImport.mode": "Innflutningshamur",
  "profileImport.chats": "Aðeins spjall",
  "profileImport.everything": "Allt (full uppsetning)",
  "profileImport.description":
    "Afritar samhæfða OpenCode-uppsetningu þína í tóma Classic-skjáborðssnið: spjall, innskráningarauðkenni þjónustuveita, skýreikninga, heimildir, altæka stillingaskrá, fulltrúa, skills, viðbætur, áætlanir, skyndimyndir og skrár vinnurýma. Uppruninn er óbreyttur. Forskoðunin keyrir ekki innflutt skipanir og haftengist ekki þjónustuveitum.",
  "profileImport.boundaries":
    "Lokaðu fyrst á OpenCode og hættu að breyta skránum þess. Verkefnamöppur utan OpenCode-geymslu haldast á upprunalegum slóðum sínum. Umhverfisbreytur, kerfisuppsett tól og uppstraumstkjörstillingar skjáborðsglugga eru ekki afrituð. Annálir, skyndiminni og ferlálæsar eru endurgerð. OAuth-þjónustuveitur geta krafist nýrrar innskráningar. Sérmöppur eru valdar í þessari röð: gögn, stillingaskrá og svo staða.",
  "profileImport.detect": "Forskoða sjálfgefna uppsetningu",
  "profileImport.browse": "Veldu uppsetningarmöppur",
  "profileImport.busy":
    "Fulla uppsetningin er verið að sannreyna eða undirbúa. Haltu Classic opnu þar til þess er lokið.",
  "profileImport.cancelled":
    "Engin samhæfur uppruni fannst, eða val möppu var hætt við.",
  "profileImport.staged":
    "Uppsetningin er undirbúin og sannreynd. Endurræstu Classic til að virkja hana áður en þjónn hennar ræsist. Ekki bæta gögnum í Classic fyrir endurræsingu; virkjunin athugar aftur að markið sé tómt.",
  "profileImport.activated":
    "Fulla uppsetningin var virkjuð. Verkefnamöppurnar þínar eru áfram tiltækar á upprunalegum slóðum sínum; innflutt innri vinnurými hafa sjálfstæð afrit.",
  "profileImport.data": "Upprunagagnamappa",
  "profileImport.config": "Upprunastillingamappa",
  "profileImport.state": "Upprunastöðumappa",
  "profileImport.providers": "Vistuð innskráningarauðkenni þjónustuveita",
  "profileImport.accounts": "Skýreikningar",
  "profileImport.workspaces": "Vinnurými",
  "profileImport.files": "Skrár og tenglar",
  "profileImport.bytes": "Stærð afritunar (bæti)",
  "profileImport.plugins": "Stilltar viðbætur",
  "profileImport.mcp": "MCP-færslur",
  "profileImport.commands": "Verkefnaskipanir",
  "profileImport.permissions": "Heimildafærslur",
  "profileImport.pending": "Biðkvæmdir prompts",
  "profileImport.git": "Git-útgáfur",
  "profileImport.consent":
    "Ég hef lokað OpenCode og treysti þessari fullu uppsetningu, þar með talið innskráningarauðkennum, endurnýjun reikninga, kerfisháðum hlutum, viðbótum, MCP-þjónum, verkefnaskipunum, Git-krókum og fyrirliggjandi heimildum. Þetta getur keyrt í venjulegri notkun eftir virkjun. Biðkvæmdir prompts verða í biðröð þar til þeim er haldið áfram.",
  "profileImport.confirm": "Undirbúa fulla uppsetningu",
  "profileImport.restart": "Endurræsa og virkja uppsetningu",
  "profileImport.error.unavailable":
    "Full innflutningur krefst innbyggða Linux-skjáborðsþjónsins og stillinga byggðra á skrám. Umhverfisveittar stillingar eða auðkenningaryfirfærslur verður að fjarlægja áður en flutt er inn.",
  "profileImport.error.nonempty":
    "Classic inniheldur þegar uppsetningargögn. Fullur innflutningur yfirskrifar þau ekki. Notaðu Aðeins spjall til að sameina samhæf samræður, eða byrjaðu með tómt Classic-snið.",
  "profileImport.error.incompatible":
    "Skema upprunagagnagrunnsins samsvarar ekki þessari Classic-útgáfu. Fullur innflutningur krefst samhæfðrar SQLite-uppsetningar; engin flutningur upprunans var reyndur.",
  "profileImport.error.invalid":
    "Ekki tókst að sannreyna uppsetninguna. Athugaðu skráarheimildir, heilleika gagnagrunns og málskipun stillinga. Verandi Classic-snið hefur ekki verið skipt út.",
  "profileImport.error.changed":
    "Uppruninn breyttist eða þessi forskoðun rann út. Lokaðu á OpenCode og aðra rithamra og forskoðaðu aftur.",
  "profileImport.error.busy":
    "Annar innflutningur, virk skráarlæsing eða bíðandi virkjun kemur í veg fyrir þessa aðgerð. Lokaðu á OpenCode og endurræstu Classic áður en þú reynir aftur.",
  "profileImport.liveWarning":
    "OpenCode virðist vera í gangi núna. Gagnagrunnur þess breytist stöðugt, svo undirbúningur getur brugðist. Lokaðu á OpenCode (öll gluggar) og stöðvaðu þjóna þess áður en þú staðfestir, fyrir áreiðanlegan innflutning.",
  "profileImport.detail.count": "Fyrirkomin atriði: {{count}}",
  "profileImport.materialized": "Ytri tenglar afritaðir inn",
  "profileImport.skipped": "Sleptar keyrsluskrár",
  "profileImport.error.source-busy":
    "Ritað er stöðugt í upprunann (líklega er OpenCode-tilvik í gangi). Lokaðu á OpenCode og þjóna þess og gerðu þá forskoðun og staðfestingu aftur.",
  "profileImport.error.links":
    "Uppsetningin inniheldur tengil sem ekki er hægt að afrita: symlink-hring, eða tengil innan Git-lýsigagna þar sem afrit verða að vera nákvæm.",
  "profileImport.error.git-objects":
    "Git-lýsigögn uppsetningarinnar nota óstudd framsetningu (alternates-færslur, worktree-bendilar eða hlutageymslur sem ekki er hægt að einkavæða örugglega).",
  "profileImport.error.special-files":
    "Uppsetningin inniheldur tækjaknúta eða aðrar sérstakar skrár sem ekki er hægt að afrita örugglega.",
  "profileImport.error.limit":
    "Uppsetningin fer yfir innflutningsmörk (50 GiB eða 500.000 atriði). Fjarlægðu stórar afritaskrár eða þrengdu möppurnar og forskoðaðu aftur.",
  "profileImport.error.oversized-file":
    "Stillingar- eða lýsigagnaskrá fer yfir lesmörk sín (64 MB fyrir stillingar, 16 MB fyrir Git-lýsigögn). Skiptu henni eða minnkaðu hana og forskoðaðu aftur.",
  "profileImport.error.unsupported":
    "Þessi uppsetning inniheldur óstudda tengla, hringrétta Git-hlutatengingar, sérstakar skrár eða fer yfir innflutningsmörk (50 GiB / 500.000 atriði). Ytri symlink-ar verða að vera efnurgerðir fyrir innflutning; upprunaskrár voru ekki breyttar.",
  "profileImport.error.space":
    "Það er ekki nóg laust diskpláss til að undirbúa þessa uppsetningu. Frigjörðu pláss og forskoðaðu aftur.",
  "chatImport.tab": "Spjallinnflutningur",
  "chatImport.title": "Flytja inn spjall úr OpenCode",
  "chatImport.description":
    "OpenCode Classic Desktop heldur eigin spjallgagnagrunni. Forskoðaðu og afritaðu samhæf staðbundin spjall úr OpenCode án þess að breyta upprunanum eða skipta út fyrirliggjandi Classic-spjalli. Þú getur komið hingað aftur úr stillingum hvenær sem er.",
  "chatImport.scope":
    "Lokaðu á OpenCode áður en þú flytur inn. Þetta afritar fullunnin staðbundin spjall og sögu þeirra. Spjall í biðröð, í vinnslu og vinnurýmisspjöll eru undanskilin. Innskráningarauðkenni, heimildir, verkefnaskipanir, ytri skrár og afturköllunarskyndimyndir eru ekki flutt inn. Skráðu þig inn sérstaklega og haltu verkefnamöppum þínum á upprunalegum slóðum.",
  "chatImport.localOnly":
    "Veldu innbyggða staðbundna skjáborðsþjóninn til að flytja inn spjall. Fjar- og bakgrunnsþjónatengingar eru ekki studdar af þessum innflutningstól.",
  "chatImport.detect": "Athuga sjálfgefinn OpenCode-gagnagrunn",
  "chatImport.browse": "Veldu gagnagrunnsskrá",
  "chatImport.confirm": "Flytja inn hæf spjall",
  "chatImport.busy":
    "Að athuga eða flytja inn spjall. Bíddu áður en þú lokar forritinu.",
  "chatImport.noSource":
    "Enginn gagnagrunnur fannst eða var valinn. Veldu OpenCode-.db-skrána þína til að halda áfram.",
  "chatImport.complete":
    "Innflutningi lokið. Opnaðu upprunalegu verkefnamöppuna til að finna spjall hennar. Endurtekinn innflutningur sleppir spjallaauðkennum sem þegar eru í Classic.",
  "chatImport.source": "Upprunagagnagrunnur",
  "chatImport.destination": "Classic-gagnagrunnur",
  "chatImport.total": "Spjall í uppruna",
  "chatImport.eligible": "Tilbúið til innflutnings",
  "chatImport.existing": "Þegar til",
  "chatImport.excluded": "Undanskilið (í biðröð, í vinnslu eða vinnurými)",
  "chatImport.imported": "Innflutt",
  "chatImport.error.unavailable":
    "Innflutningur er aðeins tiltækur fyrir innbyggða Linux-skjáborðsþjóninn eftir að ræsingu hans er lokið.",
  "chatImport.error.incompatible":
    "Gagnagrunnirnir hafa ólík eða óstudd skema. Notaðu samhæfðar og uppfærðar OpenCode- og Classic-útgáfur og forskoðaðu aftur. Eldri JSON-geymsla er ekki studd; uppruninn var ekki fluttur.",
  "chatImport.error.invalid":
    "Ekki tókst að lesa eða sannreyna gagnagrunninn. Athugaðu valda skrá, heimildir og tiltækt diskpláss. Óstaðfestur innflutningur er afturkallaður; forskoðaðu aftur áður en þú reynir aftur.",
  "chatImport.error.sameFile":
    "Uppruni og mark eru sami gagnagrunnurinn. Engin afritun er nauðsynleg.",
  "chatImport.error.conflict":
    "Verkefnis- eða skilaboðaauðkenni í árekstri komu í veg fyrir þennan innflutning. Enginn hlutiinnflutningur var staðfestur. Fyrirliggjandi Classic-spjall var varðveitt.",
  "chatImport.error.busy":
    "Gagnagrunnurinn er upptekinn eða aðgerðin tók of langan tíma. Lokaðu á OpenCode, bíddu eftir að aðrir innflutningar ljúki og forskoðaðu aftur. Ný tilraun sleppir spjalli sem þegar hefur verið staðfest.",
  "chatImport.error.expired":
    "Þessi forskoðun rann út eða uppruni hennar breyttist. Forskoðaðu gagnagrunninn aftur áður en þú flytur inn.",
}
