export default interface Ship {
  id: string
  name: string
  type: string
  image: string
  roles: Array<string>
  home_port: string
  weight_kg: number
  year_built: number
}
