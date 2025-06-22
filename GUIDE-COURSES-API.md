# 📚 GUIDE API COURSES - FRONTEND

## 🎯 OVERVIEW

L'API des cours utilise le **pattern d'expansion de champs** (field expansion), similaire aux APIs de Stripe, Facebook, etc. Cela permet de récupérer seulement les données nécessaires pour optimiser les performances.

## 🔗 RELATION COURS ↔ SESSION

```
Session (1) ──── (N) Group (1) ──── (N) Course
```

**Important :** Les cours sont liés aux sessions **indirectement** via les groupes. Utilisez le paramètre `expand` pour inclure les relations nécessaires.

## 📋 ENDPOINT PRINCIPAL

### **GET /api/v1/courses** avec expansion optionnelle

**Usage universel :** Un seul endpoint, structure adaptée selon vos besoins

### **Sans expansion (par défaut) :**

**Requête :**
```http
GET /api/v1/courses?skip=0&take=10
Authorization: Bearer {jwt_token}
```

**Réponse :**
```json
{
  "data": [
    {
      "course_uuid": "abc123-def456-ghi789",
      "course_name": "Français A1",
      "course_day": "2025-01-15",
      "course_start_hour": "09:00:00",
      "course_end_hour": "11:00:00",
      "group_uuid": "group123",
      "group": {
        "group_uuid": "group123",
        "group_label": "Groupe A1 Matin",
        "session_uuid": "session123"
      },
      "teachers": [],
      "absences": []
    }
  ]
}
```

### **Avec expansion de session :**

**Requête :**
```http
GET /api/v1/courses?expand=group.session&skip=0&take=10
Authorization: Bearer {jwt_token}
```

**Réponse :**
```json
{
  "data": [
    {
      "course_uuid": "abc123-def456-ghi789",
      "course_name": "Français A1",
      "course_day": "2025-01-15",
      "course_start_hour": "09:00:00",
      "course_end_hour": "11:00:00",
      "group_uuid": "group123",
      "group": {
        "group_uuid": "group123",
        "group_label": "Groupe A1 Matin",
        "session_uuid": "session123",
        "session": {
          "session_uuid": "session123",
          "session_label": "Session Hiver 2025",
          "session_started_at": "2025-01-01",
          "session_finished_at": "2025-03-31"
        }
      },
      "teachers": [],
      "absences": []
    }
  ]
}
```

## 🎛️ PARAMÈTRES DISPONIBLES

| Paramètre | Type | Description | Exemple |
|-----------|------|-------------|---------|
| `skip` | number | Pagination - éléments à ignorer | `skip=20` |
| `take` | number | Pagination - éléments à récupérer | `take=10` |
| `course_name` | string | Filtrer par nom (insensible à la casse) | `course_name=français` |
| `group_uuid` | string | Filtrer par groupe | `group_uuid=abc123` |
| `course_day` | date | Filtrer par date | `course_day=2025-01-15` |
| `orderBy` | JSON | Tri personnalisé | `orderBy={"course_day":"desc"}` |
| `expand` | string | **Champs à étendre** | `expand=group.session` |

## 🔄 PATTERN D'EXPANSION

### **Expansions possibles :**

| Expand | Description | Use Case |
|--------|-------------|----------|
| *(vide)* | Données de base | Calendrier simple |
| `group.session` | Inclut les données de session | Rapports, planning détaillé |
| `teachers` | Inclut les enseignants (futur) | Gestion des professeurs |
| `group.session,teachers` | Multiple expansions | Dashboard complet |

### **Exemples de requêtes :**

```http
# Calendrier simple - rapide
GET /api/v1/courses?take=50

# Planning avec sessions - complet
GET /api/v1/courses?expand=group.session&take=20

# Cours d'un groupe avec session
GET /api/v1/courses?group_uuid=abc123&expand=group.session

# Recherche avec session
GET /api/v1/courses?course_name=français&expand=group.session
```

## 🚀 EXEMPLES FRONTEND (Angular)

### **Service TypeScript optimisé :**

```typescript
@Injectable()
export class CourseService {
  private apiUrl = '/api/v1/courses';

  constructor(private http: HttpClient) {}

  // ✅ Méthode unifiée avec expansion optionnelle
  getCourses(params?: {
    skip?: number;
    take?: number;
    course_name?: string;
    group_uuid?: string;
    course_day?: string;
    orderBy?: any;
    expand?: string; // 🔑 Paramètre clé
  }): Observable<any> {
    const queryParams = this.buildQueryParams(params);
    return this.http.get(`${this.apiUrl}?${queryParams}`);
  }

  // 🎯 Méthodes spécialisées pour plus de clarté
  getCoursesBasic(params?: any): Observable<any> {
    return this.getCourses(params);
  }

  getCoursesWithSession(params?: any): Observable<any> {
    return this.getCourses({
      ...params,
      expand: 'group.session'
    });
  }

  private buildQueryParams(params: any): string {
    return Object.keys(params || {})
      .filter(key => params[key] !== undefined)
      .map(key => {
        const value = typeof params[key] === 'object' 
          ? JSON.stringify(params[key]) 
          : params[key];
        return `${key}=${encodeURIComponent(value)}`;
      })
      .join('&');
  }
}
```

### **Utilisation dans composants :**

```typescript
// Calendrier simple - optimal
export class CalendarComponent {
  courses: any[] = [];

  constructor(private courseService: CourseService) {}

  loadCalendar() {
    // ✅ Expansion non nécessaire = plus rapide
    this.courseService.getCoursesBasic({
      take: 50,
      orderBy: {course_day: 'asc'}
    }).subscribe(response => {
      this.courses = response.data;
    });
  }
}

// Rapports avec sessions - complet
export class ReportsComponent {
  coursesWithSession: any[] = [];

  constructor(private courseService: CourseService) {}

  loadReports() {
    // ✅ Expansion session nécessaire
    this.courseService.getCoursesWithSession({
      take: 100
    }).subscribe(response => {
      this.coursesWithSession = response.data;
      
      // Accès direct à la session
      response.data.forEach(course => {
        console.log(`Cours: ${course.course_name}`);
        console.log(`Session: ${course.group.session.session_label}`);
      });
    });
  }
}

// Dashboard flexible
export class DashboardComponent {
  constructor(private courseService: CourseService) {}

  loadDashboard() {
    // ✅ Expansion conditionnelle selon les besoins
    const needsSession = this.userWantsSessionData();
    
    this.courseService.getCourses({
      take: 20,
      expand: needsSession ? 'group.session' : undefined
    }).subscribe(response => {
      this.processCourses(response.data, needsSession);
    });
  }
}
```

## ⚡ OPTIMISATIONS PERFORMANCE

### **Règles d'usage :**

| Scenario | Paramètre expand | Performance |
|----------|------------------|-------------|
| 📅 Calendrier simple | *(vide)* | **Très rapide** |
| 📋 Liste de cours | *(vide)* | **Rapide** |
| 📊 Rapports de session | `group.session` | Modéré |
| 📈 Analytics complètes | `group.session` | Plus lent |

### **Bonnes pratiques :**

```typescript
// ✅ Bon usage
const calendarCourses = await getCourses({take: 50}); // Rapide
const reportCourses = await getCourses({expand: 'group.session'}); // Complet

// ❌ Usage inefficace
const simpleCourses = await getCourses({expand: 'group.session'}); // Inutile
const massiveCourses = await getCourses({take: 1000, expand: 'group.session'}); // Trop lourd
```

## 🏆 POURQUOI CETTE APPROCHE EST LA MEILLEURE

### **1. Standard industriel** 📋
- Pattern utilisé par Stripe, Facebook, GitHub APIs
- Développeurs familiers avec ce concept

### **2. Performance optimale** ⚡
- Charge uniquement les données nécessaires
- Évite le over-fetching et under-fetching

### **3. API cohérente** 🎯
- Un seul endpoint, comportement prévisible
- Documentation plus simple

### **4. Évolutivité** 🚀
- Facile d'ajouter de nouvelles expansions
- Backward compatible

### **5. Frontend intelligent** 🧠
- Le frontend contrôle exactement ce qu'il reçoit
- Optimisation automatique selon le contexte

---

💡 **Cette approche combine le meilleur des deux mondes : performance optimisée ET flexibilité maximale !** 