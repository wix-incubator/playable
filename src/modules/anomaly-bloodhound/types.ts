interface ITimeoutContainer {
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

export { ITimeoutContainer, IReportReasons, IReportType, IReportTypes };
