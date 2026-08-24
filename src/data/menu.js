const menu = [
  {
    id: '1',
    parentId: '0',
    isOn: 1,
    name: '我的办公',
    meanType: 'menu',
    code: 'RAA',
    level: 1,
    childs: [
      {
        id: '1-0',
        parentId: '1',
        isOn: 2,
        name: '数据概览',
        parentCode: '',
        code: 'RAA1',
        meanType: 'menu',
        level: 2,
        childs: [
          { id: '1-0-1', parentId: '1-0', isOn: 2, name: '操作', code: 'RAA1/A1' },
          { id: '1-0-2', parentId: '1-0', isOn: 2, name: '导出', code: 'RAA1/A2' }
        ]
      },
      {
        id: '1-1',
        parentId: '1',
        isOn: 1,
        name: '待办消息',
        code: 'RAA2',
        meanType: 'menu',
        level: 2,
        childs: []
      },
      {
        id: '1-3',
        parentId: '1',
        isOn: 1,
        name: '系统消息',
        code: 'RAA3',
        meanType: 'menu',
        level: 2,
        childs: []
      }
    ]
  },
  {
    id: '2',
    parentId: '0',
    isOn: 1,
    name: '项目管理',
    code: 'RA1',
    meanType: 'menu',
    level: 1,
    childs: [
      {
        id: '2-1',
        parentId: '2',
        isOn: 1,
        name: '项目总表',
        parentName: '项目总表',
        code: 'RA1/A',
        meanType: 'menu',
        level: 2,
        childs: [
          {
            id: '2-1-0',
            parentId: '2-1',
            isOn: 1,
            name: '列表',
            code: 'RA1/A9',
            level: 3,
            meanType: 'menu',
            childs: [
              { id: '2-1-10', parentId: '2-1-0', isOn: 1, name: '转出', code: 'RA1/A11' },
              { id: '2-1-11', parentId: '2-1-0', isOn: 1, name: '申请接入', code: 'RA1/A110' },
              { id: '2-1-12', parentId: '2-1-0', isOn: 1, name: '同步项目', code: 'RA1/A1' },
              { id: '2-1-13', parentId: '2-1-0', isOn: 1, name: '导出项目', code: 'RA1/A2' }
            ]
          },
          {
            id: '2-1-1',
            parentId: '2-1',
            isOn: 1,
            name: '关联人员',
            level: 3,
            code: 'RA1/A/A1',
            meanType: 'menu',
            childs: [
              { id: '2-1-1-1', parentId: '2-1-1', isOn: 1, name: '添加/删除/编辑', code: 'RA1/A7/A1' },
              { id: '2-1-1-2', parentId: '2-1-1', isOn: 1, name: '添加/删除/编辑', code: 'RG/G1/G6' }
            ]
          },
          { id: '2-1-2', parentId: '2-1', isOn: 1, name: '项目信息', code: 'RA1/A9', meanType: 'menu' },
          {
            id: '2-1-3',
            parentId: '2-1',
            isOn: 1,
            name: '账户信息',
            level: 3,
            code: 'RG/G1/G2/G2',
            meanType: 'menu',
            childs: [
              { id: '2-1-3-1', parentId: '2-1-3', isOn: 1, name: '编辑', code: 'RG/G1/G2/G15' }
            ]
          },
          { id: '2-1-4', parentId: '2-1', isOn: 1, name: '运营指标', code: 'RA1/A/A7', meanType: 'menu' },
          { id: '2-1-5', parentId: '2-1', isOn: 1, name: '采集方案', code: 'RA1/A/A6', meanType: 'menu' },
          { id: '2-1-6', parentId: '2-1', isOn: 1, name: '采集原值', code: 'RA1/A/A9', meanType: 'menu' },
          { id: '2-1-7', parentId: '2-1', isOn: 1, name: '承载企业', code: 'RA1/A/A8', meanType: 'menu' }
        ]
      },
      {
        id: '2-2',
        parentId: '2',
        isOn: 1,
        name: '运营模型',
        parentName: '运营模型',
        code: 'RG/G8',
        meanType: 'menu',
        level: 2,
        childs: []
      },
      {
        id: '2-3',
        parentId: '2',
        isOn: 1,
        name: '组织管理',
        parentName: '组织管理',
        code: 'RE/E1',
        meanType: 'menu',
        level: 2,
        childs: [
          { id: '2-3-1', parentId: '2-3', isOn: 1, name: '新增/编辑/删除 组织', code: 'RE/E1/E1' }
        ]
      }
    ]
  },
  {
    id: '3',
    parentId: '0',
    isOn: 1,
    name: '在建项目(租赁)',
    code: 'RF',
    meanType: 'menu',
    level: 1,
    childs: [
      {
        id: '3-3',
        parentId: '3',
        isOn: 1,
        name: '在建项目列表',
        parentName: '在建项目列表',
        code: 'RF/F1',
        meanType: 'menu',
        level: 2,
        childs: [
          {
            id: '3-3-0',
            parentId: '3-3',
            isOn: 1,
            name: '列表',
            code: 'RF/F1/A0',
            meanType: 'menu',
            level: 3,
            childs: [
              { id: '3-3-1', parentId: '3-3-0', isOn: 1, name: '结束项目', code: 'RF/F1/F4' },
              { id: '3-3-2', parentId: '3-3-0', isOn: 1, name: '导出项目', code: 'RF/F1/F5' },
              { id: '3-3-3', parentId: '3-3-0', isOn: 1, name: '删除项目', code: 'RF/F1/F6' }
            ]
          },
          { id: '3-3-4', parentId: '3-3', isOn: 1, name: '甘特图', code: 'RF/F1/A1', meanType: 'menu', level: 3 },
          { id: '3-3-5', parentId: '3-3', isOn: 1, name: '基本信息', code: 'RF/F1/A2', meanType: 'menu', level: 3 },
          { id: '3-3-6', parentId: '3-3', isOn: 1, name: '计划', code: 'RF/F1/A3', meanType: 'menu', level: 3 },
          {
            id: '3-3-7',
            parentId: '3-3',
            isOn: 1,
            name: '现场巡查',
            code: 'RF/F1/F3/F20',
            meanType: 'menu',
            level: 4,
            childs: [
              { id: '3-3-7-1', parentId: '3-3-7', isOn: 1, name: '删除', code: 'RF/F1/F3/F20/A1' },
              { id: '3-3-7-2', parentId: '3-3-7', isOn: 1, name: '导出', code: 'RF/F1/F3/F20/A2' }
            ]
          },
          { id: '3-3-8', parentId: '3-3', isOn: 1, name: '进度报表', code: 'RF/F1/F3/F13', meanType: 'menu', level: 3 },
          { id: '3-3-9', parentId: '3-3', isOn: 1, name: '巡查报告', code: 'RF/F1/F3/F15', meanType: 'menu', level: 3 },
          {
            id: '3-3-10',
            parentId: '3-3',
            isOn: 1,
            name: '项目文档',
            code: 'RF/F1/A7',
            meanType: 'menu',
            level: 3,
            childs: [
              { id: '3-27-1', parentId: '3-27', isOn: 1, name: '新增', code: 'RF/F1/F3/F5' },
              { id: '3-27-2', parentId: '3-27', isOn: 1, name: '修改/删除', code: 'RF/F1/F3/F6' }
            ]
          },
          { id: '3-3-11', parentId: '3-3', isOn: 1, name: '人员', code: 'RF/F1/A8', meanType: 'menu', level: 3 },
          { id: '3-3-12', parentId: '3-3', isOn: 1, name: '账户信息', code: 'RF/F1/F3/F18', meanType: 'menu', level: 3 },
          { id: '3-3-13', parentId: '3-3', isOn: 1, name: '付款申请', code: 'RF/F1/A10', meanType: 'menu', level: 3 },
          { id: '3-3-14', parentId: '3-3', isOn: 1, name: '资金用途', code: 'RF/F1/F3/F17', meanType: 'menu', level: 3 }
        ]
      },
      {
        id: '3-25',
        parentId: '3',
        isOn: 1,
        name: '进度报表',
        parentName: '进度报表',
        code: 'RN/N1',
        meanType: 'menu',
        level: 2,
        childs: [
          { id: '3-25-1', parentId: '3-25', isOn: 1, name: '修改日报', code: 'RN/N1/N1', meanType: 'button' },
          { id: '3-25-2', parentId: '3-25', isOn: 1, name: '查看', code: 'RF/F1/F3/F14', meanType: 'button' }
        ]
      },
      {
        id: '3-27',
        parentId: '3',
        isOn: 1,
        name: '项目文档列表',
        parentName: '项目文档列表',
        code: 'RN/N3',
        meanType: 'menu',
        level: 2,
        childs: [
          { id: '3-27-1', parentId: '3-27', isOn: 1, name: '新增', code: 'RF/F1/F3/F5' },
          { id: '3-27-2', parentId: '3-27', isOn: 1, name: '修改/删除', code: 'RF/F1/F3/F6' }
        ]
      },
      {
        id: '3-28',
        parentId: '3',
        isOn: 1,
        name: '巡查申请',
        parentName: '巡查申请',
        code: 'RN/N8',
        meanType: 'menu',
        level: 2,
        childs: [
          { id: '3-28-1', parentId: '3-28', isOn: 1, name: '巡查新增', code: 'RN/N8/N1' },
          { id: '3-28-2', parentId: '3-28', isOn: 1, name: '巡查编辑/巡查变更', code: 'RN/N8/N2' },
          { id: '3-28-3', parentId: '3-28', isOn: 1, name: '巡查删除', code: 'RN/N8/N4' },
          { id: '3-28-4', parentId: '3-28', isOn: 1, name: '所属项目', code: 'RN/N8/N3' },
          { id: '3-28-5', parentId: '3-28', isOn: 1, name: '审批', code: 'RN/N8/N5' }
        ]
      },
      {
        id: '3-29',
        parentId: '3',
        isOn: 1,
        name: '巡查月历',
        parentName: '巡查月历',
        code: 'RN/N9',
        meanType: 'menu',
        level: 2,
        childs: [
          { id: '3-29-1', parentId: '3-29', isOn: 1, name: '导出', code: 'RN/N9/N1' },
          { id: '3-29-2', parentId: '3-29', isOn: 1, name: '巡查计划删除', code: 'RN/N9/N2' }
        ]
      }
    ]
  },
  {
    id: '4',
    parentId: '0',
    icon: 'zichanyunying',
    isOn: 1,
    name: '资产运营(租赁)',
    code: 'RG',
    status: 'hide',
    meanType: 'menu',
    level: 1,
    childs: [
      {
        id: '4-1',
        parentId: '4',
        isOn: 1,
        name: '运营项目列表',
        parentName: '运营项目列表',
        code: 'RG/G1',
        meanType: 'menu',
        level: 2,
        childs: [
          {
            id: '4-1-0',
            parentId: '4-1',
            isOn: 1,
            name: '列表',
            code: 'RG/G1/A1',
            meanType: 'menu',
            level: 3,
            childs: [
              { id: '4-1-1', parentId: '4-1-0', isOn: 1, name: '操作-上传/录入', code: 'RG/G1/G3' },
              { id: '4-1-2', parentId: '4-1-0', isOn: 1, name: '操作-关闭/打开', code: 'RG/G1/G4' },
              { id: '4-1-3', parentId: '4-1-0', isOn: 1, name: '操作-编辑/删除', code: 'RG/G1/G5' },
              { id: '4-1-4', parentId: '4-1-0', isOn: 1, name: '操作-共享采集器', code: 'RG/G1/G7' }
            ]
          },
          { id: '4-1-5', parentId: '4-1', isOn: 1, name: '基本信息', code: 'RG/G1/A1', meanType: 'menu', level: 3 },
          { id: '4-1-6', parentId: '4-1', isOn: 1, name: '关联人员', code: 'RG/G1/A2', meanType: 'menu', level: 3 },
          { id: '4-1-7', parentId: '4-1', isOn: 1, name: '运营指标', code: 'RG/G1/A3', meanType: 'menu', level: 3 },
          {
            id: '4-1-8',
            parentId: '4-1',
            isOn: 1,
            name: '采集方案',
            code: 'RG/G1/A4',
            meanType: 'menu',
            level: 3,
            childs: [
              { id: '4-1-8-9', parentId: '4-1-8', isOn: 1, name: '采集方案-采集器-添加/删除 采集器', code: 'RG/G1/G2/G9' },
              { id: '4-1-8-10', parentId: '4-1-8', isOn: 1, name: '采集方案-电表-列表操作列 配置、删除', code: 'RG/G1/G2/G10' },
              { id: '4-1-8-18', parentId: '4-1-8', isOn: 1, name: '采集方案-电表-绑定关系设置', code: 'RG/G1/G2/G18' },
              { id: '4-1-8-24', parentId: '4-1-8', isOn: 1, name: '采集方案-GPS', code: 'RG/G1/G2/G24' }
            ]
          },
          {
            id: '4-1-9',
            parentId: '4-1',
            isOn: 1,
            name: '监测数据',
            code: 'RG/G1/A5',
            meanType: 'menu',
            level: 3,
            childs: [
              { id: '4-1-9-1', parentId: '4-1-9', isOn: 1, name: '监测数据GPS', code: 'RG/G1/G2/G25' },
              { id: '4-1-9-1-1', parentId: '4-1-9', isOn: 1, name: '监测数据GPS-导出', code: 'RG/G1/G2/G25/G1' },
              { id: '4-1-9-1-2', parentId: '4-1-9', isOn: 1, name: '监测数据GPS-位置详情', code: 'RG/G1/G2/G25/G2' },
              { id: '4-1-9-1-4', parentId: '4-1-9', isOn: 1, name: '监测数据GPS详情-导出', code: 'RG/G1/G2/G25/G4' }
            ]
          },
          { id: '4-1-10', parentId: '4-1', isOn: 1, name: '相关财报', code: 'RG/G1/A6', meanType: 'menu', level: 3 },
          {
            id: '4-1-11',
            parentId: '4-1',
            isOn: 1,
            name: '运营填报',
            code: 'RG/G1/A7',
            meanType: 'menu',
            level: 3,
            childs: [
              { id: '4-1-11-1', parentId: '4-1-11', isOn: 1, name: '运营填报新增', code: 'RG/G1/G2/G12' }
            ]
          },
          { id: '4-1-12', parentId: '4-1', isOn: 1, name: '付款申请', code: 'RG/G1/A8', meanType: 'menu', level: 3 },
          { id: '4-1-13', parentId: '4-1', isOn: 1, name: '关联账户', code: 'RG/G1/A9', meanType: 'menu', level: 3 },
          {
            id: '4-1-14',
            parentId: '4-1',
            isOn: 1,
            name: '备注',
            code: 'RG/G1/G2/G1',
            meanType: 'menu',
            level: 3,
            childs: [
              { id: '4-1-14-1', parentId: '4-1-14', isOn: 1, name: '操作-新增/编辑/删除', code: 'RG/G1/G2/G14' }
            ]
          },
          { id: '4-1-15', parentId: '4-1', isOn: 1, name: '承载企业', code: 'RG/G1/A11', meanType: 'menu', level: 3 },
          { id: '4-1-16', parentId: '4-1', isOn: 1, name: '情况说明', code: 'RG/G1/A12', meanType: 'menu', level: 3 },
          { id: '4-1-17', parentId: '4-1', isOn: 1, name: '资金用途', code: 'RG/G1/A13', meanType: 'menu', level: 3 }
        ]
      },
      {
        id: '4-2',
        parentId: '4',
        isOn: 1,
        name: '发电运营项目分析',
        parentName: '发电运营项目分析',
        code: 'RG/G2',
        meanType: 'menu',
        level: 2,
        childs: [
          { id: '4-2-1', parentId: '4-2', isOn: 1, name: '发电运营项目列表', code: 'RG/G2/G1' },
          { id: '4-2-2', parentId: '4-2', isOn: 1, name: '导出发电运营项目数据', code: 'RG/G2/G2' },
          { id: '4-2-3', parentId: '4-2', isOn: 1, name: '发电运营项目地区', code: 'RG/G2/G3' },
          { id: '4-2-4', parentId: '4-2', isOn: 1, name: '发电运营项目详情', code: 'RG/G2/G4' },
          { id: '4-2-5', parentId: '4-2', isOn: 1, name: '发电运营项目详情列表', code: 'RG/G2/G5' },
          { id: '4-2-6', parentId: '4-2', isOn: 1, name: '导出发电运营项目详情列表', code: 'RG/G2/G6' }
        ]
      },
      {
        id: '4-3',
        parentId: '4',
        isOn: 1,
        name: '非标运营项目分析',
        parentName: '非标运营项目分析',
        code: 'RA4/A',
        meanType: 'menu',
        level: 2,
        childs: [
          { id: '4-3-1', parentId: '4-3', isOn: 1, name: '导出运营数据列表', code: 'RA4/A1' },
          { id: '4-3-2', parentId: '4-3', isOn: 1, name: '查看运营数据详情', code: 'RA4/A2' },
          { id: '4-3-3', parentId: '4-3', isOn: 1, name: '导出运营数据详情', code: 'RA4/A2/A1' }
        ]
      },
      {
        id: '4-7',
        parentId: '4',
        isOn: 1,
        name: '数据上传',
        parentName: '数据上传',
        code: 'RA2/A1',
        meanType: 'menu',
        level: 2,
        childs: [
          {
            id: '4-7-1',
            parentId: '4-7',
            isOn: 1,
            name: '运营填报列表',
            code: 'RA2/A1/A0',
            meanType: 'menu',
            level: 3,
            childs: [
              { id: '4-7-1-1', parentId: '4-7-1', isOn: 1, name: '上传数据', code: 'RA2/A1/A1' },
              { id: '4-7-1-2', parentId: '4-7-1', isOn: 1, name: '查看数据详情', code: 'RA2/A1/A2' },
              { id: '4-7-1-3', parentId: '4-7-1', isOn: 1, name: '删除数据', code: 'RA2/A1/A3' }
            ]
          },
          {
            id: '4-7-2',
            parentId: '4-7',
            isOn: 1,
            name: '财报上传列表',
            code: 'RA2/A1/A5',
            meanType: 'menu',
            level: 3,
            childs: [
              { id: '4-7-2-1', parentId: '4-7-2', isOn: 1, name: '新增财报上传', code: 'RA2/A1/A6' },
              { id: '4-7-2-2', parentId: '4-7-2', isOn: 1, name: '编辑财报上传', code: 'RA2/A1/A7' },
              { id: '4-7-2-3', parentId: '4-7-2', isOn: 1, name: '删除财报上传', code: 'RA2/A1/A8' },
              { id: '4-7-2-4', parentId: '4-7-2', isOn: 1, name: '财报配平', code: 'RA2/A1/A9' }
            ]
          }
        ]
      },
      {
        id: '4-battery',
        parentId: '0',
        icon: 'zichanyunying',
        isOn: 1,
        name: '资产监测(经租)',
        code: 'RS',
        status: 'hide',
        meanType: 'menu',
        level: 1,
        childs: [
          {
            id: '4-battery-1',
            parentId: '4-battery',
            isOn: 1,
            name: '电池资产',
            parentName: '电池资产',
            code: 'RS/H1',
            meanType: 'menu',
            level: 2,
            childs: [
              { id: '4-battery-1-1', parentId: '4-battery-1', isOn: 1, name: '电池列表导出', code: 'RS/H1/A1' },
              { id: '4-battery-1-2', parentId: '4-battery-1', isOn: 1, name: '充电记录导出', code: 'RS/H1/A2' },
              { id: '4-battery-1-3', parentId: '4-battery-1', isOn: 1, name: '使用记录导出', code: 'RS/H1/A3' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: '5',
    parentId: '0',
    icon: 'link',
    isOn: 1,
    name: '数据接入',
    code: 'RQ/H',
    status: 'hide',
    meanType: 'menu',
    level: 1,
    childs: [
      {
        id: '5-1',
        parentId: '5',
        isOn: 1,
        name: '接入列表',
        parentName: '接入列表',
        code: 'RQ/H1',
        meanType: 'menu',
        level: 2,
        childs: [
          { id: '5-1-1', parentId: '5-1', isOn: 1, name: '编辑', code: 'RQ/H1/A1' },
          { id: '5-1-2', parentId: '5-1', isOn: 1, name: '新增监管接入', code: 'RQ/H1/A2' },
          { id: '5-1-3', parentId: '5-1', isOn: 1, name: '方案废弃', code: 'RQ/H1/A3' },
          { id: '5-1-4', parentId: '5-1', isOn: 1, name: '方案进度更新', code: 'RQ/H1/A4' },
          { id: '5-1-5', parentId: '5-1', isOn: 1, name: '方案删除', code: 'RQ/H1/A5' },
          { id: '5-1-6', parentId: '5-1', isOn: 1, name: '新增物流', code: 'RQ/H1/A7' },
          { id: '5-1-7', parentId: '5-1', isOn: 1, name: '编辑物流', code: 'RQ/H1/A8' },
          { id: '5-1-8', parentId: '5-1', isOn: 1, name: '新增设备', code: 'RQ/H1/A9' },
          { id: '5-1-9', parentId: '5-1', isOn: 1, name: '编辑设备', code: 'RQ/H1/A10' },
          { id: '5-1-10', parentId: '5-1', isOn: 1, name: '设备(验收-取消验收)', code: 'RQ/H1/A11' },
          { id: '5-1-11', parentId: '5-1', isOn: 1, name: '附件新增', code: 'RQ/H1/A12' },
          { id: '5-1-12', parentId: '5-1', isOn: 1, name: '附件删除', code: 'RQ/H1/A13' },
          { id: '5-1-13', parentId: '5-1', isOn: 1, name: '备注添加', code: 'RQ/H1/A14' },
          { id: '5-1-14', parentId: '5-1', isOn: 1, name: '备注编辑', code: 'RQ/H1/A15' },
          { id: '5-1-15', parentId: '5-1', isOn: 1, name: '备注删除', code: 'RQ/H1/A16' }
        ]
      },
      {
        id: '5-2',
        parentId: '5',
        isOn: 1,
        name: '采集数据',
        parentName: '采集数据',
        code: 'RA1/A8',
        link: '/report/list',
        meanType: 'menu',
        level: 2,
        childs: [
          { id: '5-2-1', parentId: '5-2', isOn: 1, name: '查看采集数据详情', code: 'RA1/A8/A' },
          { id: '5-2-2', parentId: '5-2', isOn: 1, name: '导出采集数据详情', code: 'RA1/A8/A1' }
        ]
      },
      {
        id: '5-3',
        parentId: '5',
        isOn: 1,
        name: '报警信息',
        parentName: '报警信息',
        code: 'RQ/H3',
        meanType: 'menu',
        level: 2,
        childs: [
          { id: '5-3-1', parentId: '5-3', isOn: 1, name: '导出报警信息', code: 'RQ/H3/A1' }
        ]
      }
    ]
  },
  {
    id: '6',
    parentId: '0',
    icon: 'huyongdianzhan',
    isOn: 1,
    name: '户用电站(经风海)',
    code: 'RH',
    status: 'hide',
    meanType: 'menu',
    level: 1,
    childs: [
      {
        id: '6-1',
        parentId: '6',
        isOn: 1,
        name: '户用电站分析',
        parentName: '户用电站分析',
        code: 'RH/H2',
        meanType: 'menu',
        level: 2,
        childs: [
          { id: '6-1-1', parentId: '6-1', isOn: 1, name: '户用电站分析-渠道详情', code: 'RH/H2/H1', meanType: 'menu', level: 3 },
          { id: '6-1-2', parentId: '6-1', isOn: 1, name: '户用电站分析-经销商详情', code: 'RH/H2/H2', meanType: 'menu', level: 3 }
        ]
      },
      {
        id: '6-2',
        parentId: '6',
        isOn: 1,
        name: '户用电站列表',
        parentName: '户用电站列表',
        code: 'RH/H3',
        meanType: 'menu',
        level: 2,
        childs: [
          { id: '6-2-1', parentId: '6-2', isOn: 1, name: '电站列表-详情', code: 'RH/H3/H1', meanType: 'menu', level: 3 }
        ]
      }
    ]
  },
  {
    id: '9',
    parentId: '0',
    icon: 'caiwujianguan',
    isOn: 1,
    name: '财务监管',
    code: 'RL',
    status: 'hide',
    meanType: 'menu',
    level: 1,
    childs: [
      {
        id: '9-1',
        parentId: '9',
        isOn: 1,
        name: '外部合同',
        parentName: '外部合同',
        code: 'RL/L7',
        meanType: 'menu',
        level: 2,
        childs: [
          { id: '9-1-1', parentId: '9-1', isOn: 1, name: '新增', code: 'RL/L7/L1' },
          { id: '9-1-2', parentId: '9-1', isOn: 1, name: '编辑', code: 'RL/L7/L2' },
          { id: '9-1-3', parentId: '9-1', isOn: 1, name: '删除', code: 'RL/L7/L3' }
        ]
      },
      {
        id: '9-2-1',
        parentId: '9-2',
        isOn: 1,
        name: '账户列表',
        code: 'RE/E7',
        meanType: 'menu',
        level: 2,
        childs: [
          { id: '9-2-1-1', parentId: '9-2-1', isOn: 1, name: '导出账户', code: 'RE/E7/E1' },
          { id: '9-2-1-2', parentId: '9-2-1', isOn: 1, name: '查看 状态详情/关联项目', code: 'RE/E7/E2' }
        ]
      },
      {
        id: '9-2-3',
        parentId: '9-2',
        isOn: 1,
        name: '账户RPA配置',
        parentName: '账户RPA配置',
        code: 'RE/E10',
        meanType: 'menu',
        level: 2,
        childs: [
          { id: '9-2-3-1', parentId: '9-2-3', isOn: 1, name: '新增/编辑/启用停用', code: 'RE/E10/E1' }
        ]
      },
      {
        id: '9-2-5',
        parentId: '9-2',
        isOn: 1,
        name: '账户监管',
        parentName: '账户监管',
        code: 'RL/L1',
        meanType: 'menu',
        level: 2,
        childs: [
          { id: '9-2-5-1', parentId: '9-2-5', isOn: 1, name: '项目经理/风控经理/资产经理', code: 'RL/L1/L1' }
        ]
      },
      {
        id: '9-4',
        parentId: '9',
        isOn: 1,
        name: '付款申请',
        parentName: '付款申请',
        code: 'RL/L2',
        meanType: 'menu',
        level: 2,
        childs: [
          { id: '9-4-1', parentId: '9-4', isOn: 1, name: '项目经理/风控经理/资产经理', code: 'RL/L2/L1' }
        ]
      },
      {
        id: '9-5',
        parentId: '9',
        isOn: 1,
        name: '对账申请',
        parentName: '对账申请',
        code: 'RL/L3',
        meanType: 'menu',
        level: 2,
        childs: [
          { id: '9-5-1', parentId: '9-5', isOn: 1, name: '新增编辑', code: 'RL/L3/L1' }
        ]
      },
      {
        id: '9-6',
        parentId: '9',
        isOn: 1,
        name: '待审批申请',
        parentName: '待审批申请',
        code: 'RL/L4',
        meanType: 'menu',
        level: 2,
        childs: []
      },
      {
        id: '9-8',
        parentId: '9',
        isOn: 1,
        name: '财报监管',
        parentName: '财报监管',
        code: 'RL/L10',
        meanType: 'menu',
        level: 2,
        childs: []
      }
    ]
  },
  {
    id: '10',
    parentId: '0',
    icon: 'caiwushangwu',
    isOn: 1,
    name: '资产商务管理',
    code: 'RC1/C',
    status: 'hide',
    meanType: 'menu',
    level: 1,
    childs: [
      {
        id: '10-1',
        parentId: '10',
        isOn: 1,
        name: '视频双录',
        parentName: '视频双录',
        code: 'RC1/C',
        meanType: 'menu',
        level: 2,
        childs: [
          { id: '10-1-1', parentId: '10-1', isOn: 1, name: '查看详情', code: 'RC1/C1' },
          { id: '10-1-2', parentId: '10-1', isOn: 1, name: '查看录制文件', code: 'RC1/C2' },
          { id: '10-1-3', parentId: '10-1', isOn: 1, name: '查看履历', code: 'RC1/C3' },
          { id: '10-1-4', parentId: '10-1', isOn: 1, name: '新增/编辑/删除合规主题', code: 'RC1/C4' },
          { id: '10-1-5', parentId: '10-1', isOn: 1, name: '添加上传', code: 'RC1/C6' }
        ]
      }
    ]
  },
  {
    id: '11',
    parentId: '0',
    icon: 'setting',
    isOn: 1,
    name: '参数管理',
    code: 'RE',
    status: 'hide',
    meanType: 'menu',
    level: 1,
    childs: [
      {
        id: '11-2',
        parentId: '11',
        isOn: 1,
        name: '部门管理',
        parentName: '部门管理',
        code: 'RE/E2',
        meanType: 'menu',
        level: 2,
        childs: [
          { id: '11-2-1', parentId: '11-2', isOn: 1, name: '新增/编辑/删除 部门', code: 'RE/E2/E1' }
        ]
      },
      {
        id: '11-3',
        parentId: '11',
        isOn: 1,
        name: '小组管理',
        parentName: '小组管理',
        code: 'RE/E3',
        meanType: 'menu',
        level: 2,
        childs: [
          { id: '11-3-1', parentId: '11-3', isOn: 1, name: '新增/编辑/删除 小组', code: 'RE/E3/E1' }
        ]
      },
      {
        id: '11-4',
        parentId: '11',
        isOn: 1,
        name: '实控人管理',
        parentName: '实控人管理',
        code: 'RE/E4',
        meanType: 'menu',
        level: 2,
        childs: []
      },
      {
        id: '11-15',
        parentId: '11',
        isOn: 1,
        name: '大屏预警数据',
        parentName: '大屏预警数据',
        code: 'RE/E15',
        meanType: 'menu',
        level: 2,
        childs: []
      },
      {
        id: '11-19',
        parentId: '11',
        isOn: 1,
        name: '行为监控',
        parentName: '行为监控',
        code: 'RE/E6',
        meanType: 'menu',
        level: 2,
        childs: [
          { id: '11-19-1', parentId: '11-19', isOn: 1, name: '导出', code: 'RE/E6/E1' }
        ]
      }
    ]
  },
  {
    id: '12',
    parentId: '0',
    icon: 'xitongguanli',
    isOn: 1,
    name: '系统管理',
    code: 'RB',
    status: 'hide',
    meanType: 'menu',
    level: 1,
    childs: [
      {
        id: '12-1',
        parentId: '12',
        isOn: 1,
        name: '人员管理',
        parentName: '人员管理',
        code: 'RB1',
        meanType: 'menu',
        level: 2,
        childs: [
          { id: '12-1-1', parentId: '12-1', isOn: 1, name: '查看人员列表', code: 'RB1/B' },
          { id: '12-1-2', parentId: '12-1', isOn: 1, name: '编辑用户/同步用户基本信息', code: 'RB1/B1' },
          { id: '12-1-3', parentId: '12-1', isOn: 1, name: '编辑用户角色', code: 'RB1/B1/B1' }
        ]
      },
      {
        id: '12-3',
        parentId: '12',
        isOn: 1,
        name: '角色管理',
        parentName: '角色管理',
        code: 'RB3',
        meanType: 'menu',
        level: 2,
        childs: [
          { id: '12-3-1', parentId: '12-3', isOn: 1, name: '查看角色列表', code: 'RB3/B' },
          { id: '12-3-2', parentId: '12-3', isOn: 1, name: '新增/编辑/删除角色', code: 'RB3/B1' }
        ]
      },
      {
        id: '12-4',
        parentId: '12',
        isOn: 1,
        name: '功能岗位',
        parentName: '功能岗位',
        code: 'RE/E14',
        link: '/system/post',
        meanType: 'menu',
        level: 2,
        childs: [
          { id: '12-4-1', parentId: '12-4', isOn: 1, name: '功能岗位-新建/编辑', code: 'RE/E14/E1' },
          { id: '12-4-2', parentId: '12-4', isOn: 1, name: '功能岗位-启用/禁用', code: 'RE/E14/E2' }
        ]
      }
    ]
  },
  {
    id: '13',
    parentId: '0',
    icon: 'xitongshezhi',
    isOn: 1,
    name: '系统配置',
    code: 'RQ',
    status: 'hide',
    meanType: 'menu',
    level: 1,
    childs: [
      {
        id: '13-1',
        parentId: '13',
        isOn: 1,
        name: '定时器执行日志',
        parentName: '定时器执行日志',
        code: 'RQ/Q1',
        meanType: 'menu',
        level: 2,
        childs: []
      },
      {
        id: '13-5',
        parentId: '13',
        isOn: 1,
        name: '平台转发配置',
        parentName: '平台转发配置',
        code: 'RQ/Q5',
        meanType: 'menu',
        level: 2,
        childs: []
      }
    ]
  },
  {
    id: '14',
    parentId: '0',
    isOn: 1,
    name: '帮助中心',
    code: 'RZ',
    meanType: 'menu',
    childs: []
  }
]

export {
  menu
}
export default menu;
