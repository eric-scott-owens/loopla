from pdb import set_trace as bp
import json
import datetime
import dateutil.parser
from .models import ReceivedCommentToPost, ReceivedKudosToPost, ReceivedKudosToComment, SentKudosToPost, SentKudosToComment, SentGroupFounderNomination, AcceptedGroupFounderNomination, ReceivedKudosToShortList, SentKudosToShortList
from users.models import Membership
from dashboard.models import Post, Comment, ShortList
from itk_invitations.models import Invitation


def get_individual_actions(user):
    received_comment_to_post = list(ReceivedCommentToPost.objects.filter(user=user))

    received_kudos_to_post = list(ReceivedKudosToPost.objects.filter(user=user))

    received_kudos_to_comment = list(ReceivedKudosToComment.objects.filter(user=user))

    received_kudos_to_short_list = list(ReceivedKudosToShortList.objects.filter(user=user))

    sent_kudos_to_post = list(SentKudosToPost.objects.filter(user=user))

    sent_kudos_to_comment = list(SentKudosToComment.objects.filter(user=user))

    sent_kudos_to_short_list = list(SentKudosToShortList.objects.filter(user=user))

    sent_group_founder_nomination = list(SentGroupFounderNomination.objects.filter(user=user))

    accepted_group_founder_nomination = list(AcceptedGroupFounderNomination.objects.filter(user=user))

    loops_started = list(Membership.objects.filter(user=user,is_founder=True))

    posts = list(Post.objects.filter(owner=user))
    comments  = list(Comment.objects.filter(owner=user))

    invitations = list(Invitation.objects.filter(inviter=user).order_by('-sent_timestamp'))

    short_list = list(ShortList.objects.filter(owner=user).order_by('-date_added'))

    d = {'received_comment_to_post' : received_comment_to_post, 'received_kudos_to_post' : received_kudos_to_post, 'received_kudos_to_comment' : received_kudos_to_comment, 'received_kudos_to_short_list' : received_kudos_to_short_list, 'sent_kudos_to_post' : sent_kudos_to_post, 'sent_kudos_to_comment' : sent_kudos_to_comment, 'sent_kudos_to_short_list' : sent_kudos_to_short_list, 'sent_group_founder_nomination' : sent_group_founder_nomination, 'accepted_group_founder_nomination' : accepted_group_founder_nomination, 'loops_started' : loops_started, 'posts': posts, 'comments': comments, 'invitations' : invitations, 'short_list': short_list}

    actions = d

    for p in actions['posts']:
        p.date = p.date_added

    for p in actions['comments']:
        p.date = p.date_added

    for p in actions['short_list']:
        p.date = p.date_added

    for p in actions['loops_started']:
        p.date = p.date_joined

    for p in actions['invitations']:
        #p.date = dateutil.parser.parse(str(p.sent_timestamp)).date()
        p.date = p.sent_timestamp

    for p in actions['loops_started']:
        # Converting date to datetime with time defaulting to midnight
        p.date = datetime.datetime(year=p.date_joined.year, month=p.date_joined.month, day=p.date_joined.day, tzinfo=datetime.timezone.utc)


    return actions

def get_actions(user, individual_actions=''):

    if not individual_actions:
        individual_actions = get_individual_actions(user)

    actions = []
    for key in individual_actions:
        actions = actions + individual_actions[key]

    sorted_actions=sorted(actions, key=lambda action: action.date, reverse=True)

    return sorted_actions

def get_selected_actions(user, individual_actions=None):

    if not individual_actions:
        individual_actions = get_individual_actions(user)

    actions = individual_actions

    appreciations = []
    appreciations = appreciations + actions['received_kudos_to_short_list'] + actions['received_kudos_to_post'] + actions['received_kudos_to_comment'] + actions['sent_kudos_to_short_list'] + actions['sent_kudos_to_post'] + actions['sent_kudos_to_comment']

    sorted_appreciations = sorted(appreciations, key=lambda appreciation: appreciation.date, reverse=True)

    sharings = []
    sharings = sharings + actions['received_comment_to_post'] + actions['posts'] + actions['comments'] + actions['short_list']

    sorted_sharings = sorted(sharings, key=lambda share: share.date, reverse=True)

    community = []
    community = community + actions['sent_group_founder_nomination'] + actions['accepted_group_founder_nomination'] + actions['loops_started'] + actions['invitations']

    sorted_community = sorted(community, key=lambda c: c.date, reverse=True)

    appreciations = []
    appreciations = appreciations + actions['received_kudos_to_post'] + actions['received_kudos_to_comment'] + actions['received_kudos_to_short_list'] + actions['sent_kudos_to_post'] + actions['sent_kudos_to_comment'] + actions['sent_kudos_to_short_list']

    sorted_appreciations = sorted(appreciations, key=lambda c: c.date, reverse=True)

    d = {'appreciation' : sorted_appreciations,
         'sharing'     : sorted_sharings,
         'community'   : sorted_community,
         'n_sent_kudos' : str(len(actions['sent_kudos_to_post']) + len(actions['sent_kudos_to_comment']) + len(actions['sent_kudos_to_short_list'])),
         'n_received_kudos' : str(len(actions['received_kudos_to_post']) + len(actions['received_kudos_to_comment']) + len(actions['received_kudos_to_short_list'])),
         'n_short_list' : str(len(actions['short_list'])),
         'n_invitations' : str(len(actions['invitations'])),
         'n_posts' : str(len(actions['posts'])),
         'n_comments' : str(len(actions['comments'])),
         'n_loops_started' : str(len(actions['loops_started']))}

    return d


#currently set to 100 hrs
def get_notification_actions(user, time_elapsed_in_seconds):
    time_elapsed = datetime.timedelta(seconds=time_elapsed_in_seconds)
    # Use of UTC by default. See settings.py
    deadline = datetime.datetime.now(datetime.timezone.utc) - time_elapsed
    received_comment_to_post = list(ReceivedCommentToPost.objects.filter(user=user, date__gte=deadline))

    received_kudos_to_post = list(ReceivedKudosToPost.objects.filter(user=user, date__gte=deadline))

    received_kudos_to_comment = list(ReceivedKudosToComment.objects.filter(user=user, date__gte=deadline))

    received_kudos_to_short_list = list(ReceivedKudosToShortList.objects.filter(user=user, date__gte=deadline))

    invitations = list(Invitation.objects.filter(inviter=user, response_timestamp__gte=deadline))


    d = {'received_comment_to_post' : received_comment_to_post, 'received_kudos_to_post' : received_kudos_to_post, 'received_kudos_to_comment' : received_kudos_to_comment, 'received_kudos_to_short_list' : received_kudos_to_short_list, 'invitations' : invitations}

    return d

def get_notification_actions_2(user, time_elapsed_in_seconds):
    """
    Same as above except doesn't convert query sets to lists
    """
    time_elapsed = datetime.timedelta(seconds=time_elapsed_in_seconds)
    # Use of UTC by default. See settings.py
    deadline = datetime.datetime.now(datetime.timezone.utc) - time_elapsed
    received_comment_to_post = ReceivedCommentToPost.objects.filter(user=user, date__gte=deadline)

    received_kudos_to_post = ReceivedKudosToPost.objects.filter(user=user, date__gte=deadline)

    received_kudos_to_comment = ReceivedKudosToComment.objects.filter(user=user, date__gte=deadline)

    received_kudos_to_short_list = ReceivedKudosToShortList.objects.filter(user=user, date__gte=deadline)

    invitations = Invitation.objects.filter(inviter=user, response_timestamp__gte=deadline)


    d = {'received_comment_to_post' : received_comment_to_post, 'received_kudos_to_post' : received_kudos_to_post, 'received_kudos_to_comment' : received_kudos_to_comment, 'received_kudos_to_short_list' : received_kudos_to_short_list, 'invitations' : invitations}

    return d
