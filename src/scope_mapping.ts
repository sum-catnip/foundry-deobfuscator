class Scope {
  name: string
  depth: number
  mappings = new Map<string, string>()

  constructor(name: string, depth: number) {
    this.name = name
    this.depth = depth
  }

  public has(id: string): boolean { return this.mappings.has(id) }
  public get(id: string): string | undefined { return this.mappings.get(id) }
  public add(from: string): string {
    let to = `${this.name}_${this.mappings.size}`
    if (this.depth > 0) to = `${to}_${this.depth}`
    this.mappings.set(from, to)
    return to
  }
}

export class ScopeStackMapping {
  private scopes: Scope[] = [new Scope('globals', 0)]

  public resolve_or_new(id: string): string {
    return this.scopes.slice().reverse().find(x => x.has(id))?.get(id) ??
      this.map(id)
  }

  public enter_scope(id: string) { 
    this.scopes.push(new Scope(id, this.scopes.filter((s) => s.name == id).length))
  }

  public leave_scope() { this.scopes.pop() }
  public scoped<T>(id: string, f: () => T) : T {
    this.enter_scope(id)
    const r = f()
    this.leave_scope()

    return r
  }

  public map(from: string) : string {
    return this.scopes.slice(-1)[0].add(from)
  }
}
