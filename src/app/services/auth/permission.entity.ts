export class Privilege {
  constructor(
    public id = '',
    public parent_id = '',
    public title = '',
    public desc = '',
    public extra = '',
    public order = 0,
    public state = 0,
    public ctime = 0,
    public mtime = 0,
  ) {
  }

  static from(config: any) {
    return Object.assign(new Privilege(), config);
  }
}

export class MenuItem {
  constructor(
    public id = 0,
    public privileged_id = 0,
    public title = '',
    public icon_classes = '',
    public url = '',
    public desc = '',
    public state = 0,
    public ctime = 0,
    public mtime = 0,
  ) {
  }

  static from(config: any) {
    return Object.assign(new MenuItem(), config);
  }
}

export class PermissionNodeDef {

  constructor(
    public privilege: Privilege,
    public menu_item: MenuItem | null,
    public children: PermissionNodeDef[] | null,
    public path: string[] = [],
    public before: string | null = null,
    public after: string | null = null,
  ) {
  }

  get type(): number {
    if (this.menu_item) {
      if (this.menu_item.url) {
        return 2;
      } else {
        return 1;
      }
    } else {
      if (this.path.includes('2')) {
        return 4;
      } else {
        return 3;
      }
    }
  }

  get nodeType() {
    if (this.menu_item) {
      if (this.menu_item.url) {
        return 'page';
      } else {
        return 'menu';
      }
    } else {
      if (this.path.includes('2')) {
        return 'data_source';
      } else {
        return 'normal';
      }
    }
  }

  getNodeMap() {
    let map = new Map<string, PermissionNodeDef>();
    let scan = (node: PermissionNodeDef) => {
      const { children, privilege: { id } } = node;
      map.set(id, node);
      if (children) {
        for (let child of children) {
          scan(child);
        }
      }
    };
    scan(this);
    return map;
  }

  static from(obj: any, path: string[]) {
    const { privilege, menu_item, children } = obj;
    let node = new PermissionNodeDef(
      Privilege.from(privilege),
      menu_item && MenuItem.from(menu_item),
      children && children.map(child => PermissionNodeDef.from(child, path.concat(privilege.id + ''))),
      path,
    );
    if (node.children) {
      let before = null as PermissionNodeDef | null;
      for (let child of node.children) {
        if (before) {
          before.after = child.privilege.id;
        }
        child.before = before?.privilege.id || null;
        before = child;
      }
      if (before) {
        before.after = null;
      }
    }
    return node;
  }

}
