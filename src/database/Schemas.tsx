import Realm from 'realm'

export const PROJECT_SCHEMA = "Project"
export const TIME_EXPENDED_SCHEMA = "TimeExpended"

export const ProjectSchema = {
    name: PROJECT_SCHEMA,
    primaryKey: 'key',
    properties: {
        key: 'string',
        name: 'string',
        color: 'string',
        parentProject: { type: 'string', optional: true, default: '' },
        goal: { type: 'float', optional: true, default: 0 },
        active: { type: 'bool', default: true },
        timeExpended: { type: TIME_EXPENDED_SCHEMA + "[]", default: [] },
        createdAt: { type: 'date', default: new Date(Date.now()) }
    }
}

export const TimeExpendedSchema = {
    name: TIME_EXPENDED_SCHEMA,
    properties: {
        key: 'string',
        startDate: 'string',
        endDate: 'string'
    }
}

export const CurrentProjectSchema = {
    name: 'CurrentProject',
    primaryKey: 'key',
    properties: {
        key: 'string',
        startDate: {type: 'string', optional: true, default: undefined},
        endDate: {type: 'string', optional: true, default: undefined}
    }
}

const databaseOptions: Realm.Configuration = {
    path: 'GoodTimeExpended.realm',
    schema: [ProjectSchema, TimeExpendedSchema, CurrentProjectSchema],
    schemaVersion: 0
}
const realm = new Realm(databaseOptions)

export function getProject(key: string){
    let obj: any = {}
    realm.objectForPrimaryKey(PROJECT_SCHEMA, key)
        ?.entries()
        .map(property => obj[property[0]] = property[1])

    return obj
}

export function insertProject(newProject: any) {
    realm.write(() => {
        realm.create(PROJECT_SCHEMA, newProject)
    })
}

export function updateProject(project: any){
    realm.write(() => {
        realm.create(PROJECT_SCHEMA, project, Realm.UpdateMode.Modified)
    })
}

export function deleteProject(projectKey: string){
    realm.write(() => {
        let project = realm.objectForPrimaryKey(ProjectSchema.name, projectKey) as any

        project.timeExpended.forEach((timeExpended: any) => {
            realm.delete(timeExpended)
        });
        realm.delete(project)
    })
}

export function getAllProjects(): Realm.Results<any> {
    let projects = realm.objects(ProjectSchema.name)
    return projects
}

export function getAllTimeExpended(): Realm.Results<any> {
    return realm.objects(TimeExpendedSchema.name)
}

export function getCurrentProject(): any {
    try {
        let project_properties = realm.objects('CurrentProject')[0].entries()

        let obj: any = {}
        project_properties.map(property => obj[property[0]] = property[1])
        return obj            
    } catch (error) {
        return {}
    }
}

export function updateCurrentProject(project: any) {
    realm.write(() => {
        realm.delete(realm.objects('CurrentProject'))
        realm.create('CurrentProject', project)
    })
}

export function addTimeExpended(timeExpended: any): any {
    realm.write(() => {
        let project = realm.objectForPrimaryKey(ProjectSchema.name, timeExpended.key) as any
        if(!project) return;

        project.timeExpended.push(timeExpended)
    })
}

export function clearAllData(){
    realm.write(() => {
        realm.delete(realm.objects('CurrentProject'))
        realm.delete(realm.objects(TIME_EXPENDED_SCHEMA))
        realm.delete(realm.objects(PROJECT_SCHEMA))
    })   
}