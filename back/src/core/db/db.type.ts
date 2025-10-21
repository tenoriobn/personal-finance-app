export interface FindOrFailOptions {
  select?: object;
  include?: object;
  checkOwnership?: boolean;
  notFoundMessage?: string;
}