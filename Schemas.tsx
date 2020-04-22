import Realm from 'realm'

export const PROJECT_SCHEMA = "Project"
export const TIME_EXPENDED_SCHEMA = "TimeExpended"

export const ProjectSchema: Realm.ObjectSchema = {
    name: PROJECT_SCHEMA,
    primaryKey: 'key',
    properties: {
        key: 'string',
        name: 'string',
        parentProject: 'string',
        color: 'string',
        goal: 'float',
        timeExpended: {
            type: "list", objectType: TIME_EXPENDED_SCHEMA
        },
        createdAt: 'date'
    }
}

export const TimeExpendedSchema = {
    name: TIME_EXPENDED_SCHEMA,
    properties: {
        start_date: 'string',
        end_date: 'string'
    }
}

const databaseOptions: Realm.Configuration = {
    path: 'GoodTimeExpended.realm',
    schema: [ProjectSchema, TimeExpendedSchema],
    schemaVersion: 0
}
export function insertProject(newProject: any){
    return new Promise((resolve, reject) => {
        Realm.open(databaseOptions)
        .then(realm => {
            realm.create(PROJECT_SCHEMA, newProject)
            resolve(newProject)
            realm.close()
        })
        .catch((error) => reject(error))
    })
}

export function getAllProjects(){
    return new Promise((resolve, reject) => {
        Realm.open(databaseOptions)
        .then(realm => {
            resolve(realm.objects(PROJECT_SCHEMA))
            realm.close()
        })
        .catch((error) => reject(error))
    })
}