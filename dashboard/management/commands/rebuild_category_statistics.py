from django.core.management.base import BaseCommand, CommandError
from django.contrib.auth.models import Group
from dashboard.models import CategoryStatistics

class Command(BaseCommand):

  def add_arguments(self, parser):
    parser.add_argument(
      '-g',
      '--group',
      type=int,
      help='Specify a group, by ID, to rebuild category statistics for (default is all).'
    )

  def handle(self, *args, **options):
    if options['group']:
      group = Group.objects.get(pk=options['group'])
      CategoryStatistics.calculate_statistics_for_group(group)
    else:
      CategoryStatistics.calculate_statistics()