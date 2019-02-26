interface ITimeoutMap {
  [id: string]: number;
}

interface IReportType {
  id: string;
  timeoutTime: number;
}

interface IReportTypes {
  [id: string]: IReportType;
}

interface IReportReasons {
  [id: string]: string;
}

export { ITimeoutMap, IReportReasons, IReportType, IReportTypes };
