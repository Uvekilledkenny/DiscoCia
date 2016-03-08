{
  'targets': [
    {
      'target_name': 'makecdncia',
      'type': 'executable',
      'cflags': ['-O2', '-Wall'],
      'sources': [
        './makeCdnCia/main.c',
        './makeCdnCia/cia.c',
        './makeCdnCia/chunkio.c',
      ],
    },
  ],
}