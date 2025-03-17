declare module 'vue3-smooth-dnd';
declare module '@tanstack/vue-table' {
  export type Updater<TInput, TOutput> = TOutput | ((old: TInput) => TOutput);
}
//
