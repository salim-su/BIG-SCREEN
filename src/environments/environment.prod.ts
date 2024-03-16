export const environment = {
  SERVER_URL: `/api/`,
  OSS_URL: 'blade-system/business-oss/',
  FILE_PREVIEW_URL: 'http://10.163.200.140:10499/',
  FINE_REPORT_URL: 'http://10.10.21.38:8080/webroot/decision/view/report?viewlet=',
  production: false,
  useHash: true,
  btnLogin: false,
  hmr: false,
  dict: {
    workShift: 'work_shift',
    cargoName: 'cargo_name',
    cargoPackage: 'cargo_package',
    workPlace: 'work_place',
    team: 'team',
    yesOrNo: [
      {
        dictValue: '是',
        dictKey: 1
      },
      {
        dictValue: '否',
        dictKey: 0
      }
    ]
  },
  subsystem: {
    bulk: {
      code: 'bulk_cargo_tally',
      id: '1678944647042433026',
      name: '散货理货系统'
    }
  },
  nzPageSizeOptions: [5, 10, 15, 20, 25, 30]
};
